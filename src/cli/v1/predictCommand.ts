import { Command, Option, OptionValues } from "commander";
import { Client as ClientV1, PredictOptions } from "@/v1/client.js";
import { PathInput } from "@/input/index.js";
import {
  Document,
  Inference,
  PredictResponse,
  StringDict,
  AsyncPredictResponse,
} from "@/v1/parsing/common/index.js";
import { OUTPUT_DESCRIPTION, OutputType, parseOutput } from "../output.js";

export type InferenceClass<T extends Inference> = new (rawPrediction: StringDict) => T;

/**
 * Abstract base for all V1 predict commands.
 *
 * Each product owns its own subclass that toggles the flags it supports
 * (`--all-words`, `--full-text`, `--async`) by overriding
 * `addProductOptions`. There is intentionally no shared options bag:
 * every command flag is added explicitly per product.
 */
export abstract class PredictCommand<T extends Inference> extends Command {
  protected constructor(name: string, description: string) {
    super(name);
    this.description(description);
    this.addBaseOptions();
    this.addProductOptions();
    this.addOutputOptions();
    this.argument("<input_path>", "Full path to the file to parse");

    this.action(async (inputPath: string, options: OptionValues, command: Command) => {
      await this.run(inputPath, this.mergeOptions(command, options));
    });
  }

  /** The Inference class constructor for the product. */
  protected abstract get inferenceClass(): InferenceClass<T>;

  /**
   * Add product-specific options.
   *
   * Subclasses override to add the flags the product supports
   * (`-w/--all-words`, `-f/--full-text`, `--async`).
   */
  protected addProductOptions(): void {
    // No-op by default. Subclasses override.
  }

  /**
   * Adds the `-w/--all-words` flag. Call from `addProductOptions`
   * for products that support `allWords`.
   */
  protected addAllWordsOption(): void {
    this.option(
      "-w, --all-words",
      "Retrieve all the words in the current document.",
      false
    );
  }

  /**
   * Adds the `-f/--full-text` flag. Call from `addProductOptions`
   * for products that support `fullText`.
   */
  protected addFullTextOption(): void {
    this.option(
      "-f, --full-text",
      "Retrieve the full text representation of the document.",
      false
    );
  }

  /**
   * Adds a user-visible `--async` flag for products that support both
   * synchronous and asynchronous endpoints.
   */
  protected addAsyncOption(): void {
    this.option(
      "--async",
      "Process the file asynchronously.",
      false
    );
  }

  /**
   * Whether the command should call the async endpoint.
   *
   * Override to force async for async-only products.
   */
  protected isAsync(options: OptionValues): boolean {
    return options.async === true;
  }

  /** Whether the product supports `--all-words`. */
  protected get supportsAllWords(): boolean {
    return false;
  }

  /** Whether the product supports `--full-text`. */
  protected get supportsFullText(): boolean {
    return false;
  }

  private addBaseOptions(): void {
    this.option("-k, --api-key <api_key>", "Mindee V1 API key");
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
    const client = new ClientV1({
      apiKey: options.apiKey,
      debug: options.verbose,
    });
    const inputSource = new PathInput({ inputPath: inputPath });
    const predictParams: PredictOptions = {
      allWords: this.supportsAllWords ? options.allWords === true : undefined,
      fullText: this.supportsFullText ? options.fullText === true : undefined,
      ...this.extraPredictOptions(client, options),
    };

    const response = this.isAsync(options)
      ? await client.enqueueAndParse(this.inferenceClass, inputSource, {
        ...predictParams,
        initialDelaySec: 2,
        delaySec: 1.5,
        maxRetries: 80,
      })
      : await client.parse(this.inferenceClass, inputSource, predictParams);

    if (!response || !response.document) {
      console.log("null");
      return;
    }

    this.printResponse(response, options.output as OutputType);
  }

  /**
   * Hook for subclasses to inject extra predict options (e.g. a custom
   * endpoint for the `generated` product).
   *
   * @param _client V1 client instance.
   * @param _options parsed CLI options.
   * @returns extra predict options to merge in.
   */
  protected extraPredictOptions(
    _client: ClientV1,
    _options: OptionValues
  ): Partial<PredictOptions> {
    void _client;
    void _options;
    return {};
  }

  private printResponse(
    response: PredictResponse<T> | AsyncPredictResponse<T>,
    output: OutputType
  ): void {
    const document = response.document!;
    switch (output) {
    case OutputType.full:
      this.printFull(document);
      break;
    case OutputType.summary:
      console.log(`\n${document.inference.prediction.toString()}`);
      break;
    case OutputType.raw:
      console.log(JSON.stringify(response.getRawHttp(), null, 2));
      break;
    default:
      throw new Error(`Unknown output type: ${output}.`);
    }
  }

  private printFull(document: Document<T>): void {
    if (this.supportsAllWords && document.ocr) {
      console.log("#############\nDocument Text\n#############\n::\n");
      const ocr = document.ocr.toString().replace(/\n/g, "\n  ");
      console.log(`  ${ocr}\n`);
    } else if (this.supportsFullText) {
      const fullTextOcr = document.inference.extras?.["fullTextOcr"];
      if (fullTextOcr) {
        console.log("#############\nDocument Text\n#############\n::\n");
        const ocr = fullTextOcr.toString().replace(/\n/g, "\n  ");
        console.log(`  ${ocr}\n`);
      }
    }
    console.log(`\n${document.toString()}`);
  }
}
