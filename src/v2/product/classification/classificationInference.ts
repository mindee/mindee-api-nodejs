import { StringDict } from "@/parsing/index.js";
import { BaseInference } from "@/v2/parsing/inference/baseInference.js";
import { ClassificationResult } from "./classificationResult.js";

/** Inference payload for classification responses. */
export class ClassificationInference extends BaseInference {
  /**
   * Result of a classification inference.
   */
  result: ClassificationResult;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.result = new ClassificationResult(serverResponse["result"]);
  }

  /** Returns a readable representation of the inference. */
  toString(): string {
    return (
      super.toString() +
      this.result.toString() + "\n"
    );
  }
}
