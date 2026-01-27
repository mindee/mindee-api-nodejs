import { StringDict } from "@/parsing/index.js";
import { BaseInference } from "@/v2/parsing/inference/baseInference.js";
import { CropResult } from "@/v2/parsing/inference/crop/cropResult.js";

export class CropInference extends BaseInference {
  /**
   * Result of a crop utility inference.
   */
  result: CropResult;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.result = new CropResult(serverResponse["result"]);
  }

  toString(): string {
    return (
      "Inference\n" +
      "#########\n" +
      this.model.toString() + "\n" +
      this.file.toString() + "\n" +
      this.result.toString() + "\n"
    );
  }
}
