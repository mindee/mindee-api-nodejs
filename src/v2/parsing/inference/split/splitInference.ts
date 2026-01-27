import { StringDict } from "@/parsing/index.js";
import { BaseInference } from "@/v2/parsing/inference/baseInference.js";

export class SplitInference extends BaseInference {
  /**
   * Result of a split inference.
   */
  result: any;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.result = serverResponse["result"];
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
