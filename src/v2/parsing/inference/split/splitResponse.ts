import { StringDict } from "@/parsing/stringDict.js";
import { BaseInferenceResponse } from "@/v2/parsing/inference/baseInferenceResponse.js";
import { SplitInference } from "./splitInference.js";

export class SplitResponse extends BaseInferenceResponse {
  /**
   * The inference result for a split request.
   */
  public inference: SplitInference;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new SplitInference(serverResponse["inference"]);
  }
}
