import { OptionValues } from "commander";
import { InferenceCommand } from "./inferenceCommand.js";
import { Extraction } from "@/v2/product/extraction/extraction.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";
import { BaseInference } from "@/v2/parsing/inference/index.js";
import { ExtractionInference } from "@/v2/product/extraction/extractionInference.js";

/**
 * CLI command for the V2 `extraction` product.
 *
 * Owns all extraction-specific flags (`--rag`, `--raw-text`,
 * `--confidence`, `--polygon`, `--text-context`). These are
 * deliberately *not* shared with other inference commands.
 */
export class ExtractionCommand extends InferenceCommand {
  constructor() {
    super("extraction", "Generic all-purpose extraction.");
  }

  protected get productSlug(): string {
    return Extraction.slug;
  }

  protected get productClass(): typeof BaseProduct {
    return Extraction;
  }

  protected addProductOptions(): void {
    this.option(
      "-g, --rag",
      "Enable Retrieval-Augmented Generation context. Extraction only.",
      false
    );
    this.option(
      "-r, --raw-text",
      "Extract all the words in the document.",
      false
    );
    this.option(
      "-c, --confidence",
      "Retrieve confidence scores from the extraction.",
      false
    );
    this.option(
      "-p, --polygon",
      "Retrieve bounding-box polygons from the extraction.",
      false
    );
    this.option(
      "-t, --text-context <text>",
      "Add text context to the API call.",
      undefined as unknown as string
    );
  }

  protected buildParameters(options: OptionValues) {
    return {
      modelId: options.modelId as string,
      alias: options.alias as string | undefined,
      rag: options.rag as boolean,
      rawText: options.rawText as boolean,
      confidence: options.confidence as boolean,
      polygon: options.polygon as boolean,
      textContext: options.textContext as string | undefined,
    };
  }

  protected printFull(inference: BaseInference): void {
    const extraction = inference as ExtractionInference;
    if (extraction.activeOptions?.rawText && extraction.result?.rawText) {
      console.log("#############\nRaw Text\n#############\n::\n");
      const rawText = extraction.result.rawText.toString().replace(/\n/g, "\n  ");
      console.log(`  ${rawText}\n`);
    }
    if (extraction.activeOptions?.rag && extraction.result?.rag) {
      console.log("#############\nRetrieval-Augmented Generation\n#############\n::\n");
      const ragString = typeof extraction.result.rag.toString === "function"
        && extraction.result.rag.toString !== Object.prototype.toString
        ? extraction.result.rag.toString()
        : JSON.stringify(extraction.result.rag, null, 2);
      console.log(`  ${ragString.replace(/\n/g, "\n  ")}\n`);
    }
    console.log(`\n${extraction.toString()}`);
  }
}
