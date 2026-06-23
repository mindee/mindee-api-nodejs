import { OptionValues } from "commander";
import { InferenceCommand } from "./inferenceCommand.js";
import { Classification } from "@/v2/product/classification/classification.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/** CLI command for the V2 `classification` product. */
export class ClassificationCommand extends InferenceCommand {
  constructor() {
    super("classification", "Classification utility.");
  }

  protected get productSlug(): string {
    return Classification.slug;
  }

  protected get productClass(): typeof BaseProduct {
    return Classification;
  }

  protected buildParameters(options: OptionValues) {
    return {
      modelId: options.modelId as string,
      alias: options.alias as string | undefined,
    };
  }
}
