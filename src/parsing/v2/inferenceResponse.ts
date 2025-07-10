import { CommonResponse } from "./commonResponse";
import { Inference } from "./inference";
import { StringDict } from "../common";

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
