import { ExtractionInference } from "./extractionInference.js";
import { StringDict } from "@/parsing/stringDict.js";
import { BaseInferenceResponse } from "@/v2/parsing/inference/baseInferenceResponse.js";

export class ExtractionResponse extends BaseInferenceResponse {
  /**
   * The inference result for an extraction request.
   */
  public inference: ExtractionInference;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new ExtractionInference(serverResponse["inference"]);
  }
}
