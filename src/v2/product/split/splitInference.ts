import { StringDict } from "@/parsing/index.js";
import { BaseInference } from "@/v2/parsing/inference/baseInference.js";
import { SplitResult } from "./splitResult.js";

export class SplitInference extends BaseInference {
  /**
   * Result of a split inference.
   */
  result: SplitResult;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.result = new SplitResult(serverResponse["result"]);
  }

  toString(): string {
    return (
      super.toString() +
      this.result.toString() + "\n"
    );
  }
}
