import { StringDict } from "@/parsing/index.js";
import { BaseInference } from "@/v2/parsing/inference/baseInference.js";
import { CropResult } from "@/v2/product/crop/cropResult.js";

/** Inference payload for crop responses. */
export class CropInference extends BaseInference {
  /**
   * Result of a crop utility inference.
   */
  result: CropResult;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.result = new CropResult(serverResponse["result"]);
  }

  /** Returns a readable representation of the inference. */
  toString(): string {
    return (
      super.toString() +
      this.result.toString() + "\n"
    );
  }
}
