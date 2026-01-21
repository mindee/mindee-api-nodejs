import { StringDict } from "@/parsing/stringDict.js";
import { CropInference } from "./cropInference.js";
import { BaseInferenceResponse } from "@/v2/parsing/inference/baseInferenceResponse.js";

export class CropResponse extends BaseInferenceResponse {
  /**
   * The inference result for a crop request.
   */
  public inference: CropInference;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new CropInference(serverResponse["inference"]);
  }
}
