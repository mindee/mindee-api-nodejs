import { OptionValues } from "commander";
import { InferenceCommand } from "./inferenceCommand.js";
import { Ocr } from "@/v2/product/ocr/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/** CLI command for the V2 `ocr` product. */
export class OcrCommand extends InferenceCommand {
  constructor() {
    super("ocr", "OCR utility.");
  }

  protected get productSlug(): string {
    return Ocr.slug;
  }

  protected get productClass(): typeof BaseProduct {
    return Ocr;
  }

  protected buildParameters(options: OptionValues) {
    return {
      modelId: options.modelId as string,
      alias: options.alias as string | undefined,
    };
  }
}
