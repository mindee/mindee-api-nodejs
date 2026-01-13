import { CommonResponse } from "./commonResponse.js";
import { Inference } from "./inference.js";
import { StringDict } from "@/parsing/stringDict.js";

export class InferenceResponse extends CommonResponse {
  /**
   * Inference result.
   */
  public inference: Inference;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new Inference(serverResponse["inference"]);
  }
}
