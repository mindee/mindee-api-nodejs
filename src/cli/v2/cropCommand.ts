import { OptionValues } from "commander";
import { InferenceCommand } from "./inferenceCommand.js";
import { Crop } from "@/v2/product/crop/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/** CLI command for the V2 `crop` product. */
export class CropCommand extends InferenceCommand {
  constructor() {
    super("crop", "Crop utility.");
  }

  protected get productSlug(): string {
    return Crop.slug;
  }

  protected get productClass(): typeof BaseProduct {
    return Crop;
  }

  protected buildParameters(options: OptionValues) {
    return {
      modelId: options.modelId as string,
      alias: options.alias as string | undefined,
    };
  }
}
