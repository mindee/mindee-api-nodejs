import { ExtractionInference } from "./extractionInference.js";
import { StringDict } from "@/parsing/stringDict.js";
import { BaseResponse } from "@/v2/parsing/index.js";

export class ExtractionResponse extends BaseResponse {

  /**
   * The inference result for an extraction request.
   */
  inference: ExtractionInference;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new ExtractionInference(serverResponse["inference"]);
  }
}
