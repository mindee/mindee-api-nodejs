import { OptionValues } from "commander";
import { InferenceCommand } from "./inferenceCommand.js";
import { Split } from "@/v2/product/split/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/** CLI command for the V2 `split` product. */
export class SplitCommand extends InferenceCommand {
  constructor() {
    super("split", "Split utility.");
  }

  protected get productSlug(): string {
    return Split.slug;
  }

  protected get productClass(): typeof BaseProduct {
    return Split;
  }

  protected buildParameters(options: OptionValues) {
    return {
      modelId: options.modelId as string,
      alias: options.alias as string | undefined,
    };
  }
}
