import { Command, Option, OptionValues } from "commander";
import * as console from "console";
import { Client as ClientV2 } from "@/v2/client.js";
import { PathInput, UrlInput, InputSource } from "@/input/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";
import { BaseResponse } from "@/v2/parsing/baseResponse.js";
import { BaseInference } from "@/v2/parsing/inference/index.js";
import { OUTPUT_DESCRIPTION, OutputType, parseOutput } from "../output.js";

/**
 * Abstract base class for all V2 inference commands.
 *
 * Each product (extraction, classification, crop, ocr, split) extends this
 * class and adds its own product-specific options through `addProductOptions`
 * and turns parsed CLI options into the corresponding product parameters
 * via `buildParameters`.
 *
 * This deliberately avoids using a shared configuration object for options
 * such as `rag`, `rawText`, `polygon`, `confidence`, `textContext`; each
 * product owns its CLI surface.
 */
export abstract class InferenceCommand extends Command {
  protected constructor(name: string, description: string) {
    super(name);
    this.description(description);
    this.addBaseOptions();
    this.addProductOptions();
    this.addOutputOptions();
    this.argument("<input_path>", "Full path or URL to the file to parse");

    this.action(async (inputPath: string, options: OptionValues, command: Command) => {
      await this.run(inputPath, this.mergeOptions(command, options));
    });
  }

  /**
   * Slug of the product the command targets (must match `BaseProduct.slug`).
   */
  protected abstract get productSlug(): string;

  /**
   * The Product class registered in `@/v2/product`. Used to obtain the
   * `parametersClass` and `responseClass` constructors.
   */
  protected abstract get productClass(): typeof BaseProduct;

  /**
   * Add product-specific options (e.g. `--rag`, `--raw-text`).
   *
   * By default, no extra option is added. Subclasses override this to add
   * the flags they support.
   */
  protected addProductOptions(): void {
    // No-op by default. Subclasses override.
  }

  /**
   * Build the product parameters from parsed CLI options.
   *
   * Each subclass returns the typed parameter constructor argument for
   * its product, so we avoid a shared options bag.
   */
  protected abstract buildParameters(
    options: OptionValues
  ): ConstructorParameters<ReturnType<() => typeof BaseProduct>["parametersClass"]>[0];

  private addBaseOptions(): void {
    this.requiredOption("-m, --model-id <model_id>", "ID of the model to use");
    this.option("-k, --api-key <api_key>", "Mindee V2 API key");
    this.option("-a, --alias <alias>", "Alias for the file");
  }

  private addOutputOptions(): void {
    this.addOption(
      new Option("-o, --output <type>", OUTPUT_DESCRIPTION)
        .argParser(parseOutput)
        .default(OutputType.summary, "summary")
    );
  }

  private mergeOptions(command: Command, options: OptionValues): OptionValues {
    let merged: OptionValues = { ...options };
    let cursor: Command | null = command.parent;
    while (cursor) {
      merged = { ...cursor.opts(), ...merged };
      cursor = cursor.parent;
    }
    return merged;
  }

  private async run(inputPath: string, options: OptionValues): Promise<void> {
    const client = new ClientV2({
      apiKey: options.apiKey,
      debug: options.verbose,
    });

    const inputSource: InputSource = inputPath.startsWith("https://")
      ? new UrlInput({ url: inputPath })
      : new PathInput({ inputPath: inputPath });

    const product = this.productClass;
    const params = this.buildParameters(options);

    const response = await client.enqueueAndGetResult(product, inputSource, params, {
      initialDelaySec: 2,
      delaySec: 1.5,
      maxRetries: 80,
    });

    if (!response.inference) {
      throw new Error("Inference could not be retrieved");
    }

    this.printResponse(response, options.output as OutputType);
  }

  protected printResponse(response: BaseResponse, output: OutputType): void {
    const inference = (response as unknown as { inference: BaseInference }).inference;
    switch (output) {
    case OutputType.full:
      this.printFull(inference);
      break;
    case OutputType.summary:
      this.printSummary(inference);
      break;
    case OutputType.raw:
      console.log(JSON.stringify(response.getRawHttp(), null, 2));
      break;
    default:
      throw new Error(`Unknown output type: ${output}.`);
    }
  }

  /**
   * Print the full representation of the inference (used for `--output full`).
   *
   * By default this prints the inference's own `toString`. Subclasses
   * override to add product-specific sections (such as raw text or RAG).
   */
  protected printFull(inference: BaseInference): void {
    console.log(`\n${inference.toString()}`);
  }

  /**
   * Print the summary representation of the inference (used for `--output summary`).
   *
   * Subclasses override when their result type has a `toString` worth printing.
   */
  protected printSummary(inference: BaseInference): void {
    const result = (inference as unknown as { result?: { toString(): string } }).result;
    if (result && typeof result.toString === "function") {
      console.log(`\n${result.toString()}`);
    } else {
      console.log(`\n${inference.toString()}`);
    }
  }
}
