import { StringDict } from "@/parsing/stringDict.js";
import { InferenceResult } from "./inferenceResult.js";
import { InferenceActiveOptions } from "./inferenceActiveOptions.js";
import { BaseInference } from "@/v2/parsing/baseInference.js";

export class Inference extends BaseInference {
  /**
   * Result of the inference.
   */
  public result: InferenceResult;
  /**
   * Active options for the inference.
   */
  public activeOptions: InferenceActiveOptions;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.result = new InferenceResult(serverResponse["result"]);
    this.activeOptions = new InferenceActiveOptions(serverResponse["active_options"]);
  }

  toString(): string {
    return (
      "Inference\n" +
      "#########\n" +
      this.model.toString() + "\n" +
      this.file.toString() + "\n" +
      this.activeOptions.toString() + "\n" +
      this.result + "\n"
    );
  }
}
