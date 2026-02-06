import { StringDict } from "@/parsing/stringDict.js";
import { OcrInference } from "./ocrInference.js";
import { BaseResponse } from "@/v2/parsing/index.js";

export class OcrResponse extends BaseResponse {
  /**
   * Response for an OCR utility inference.
   */
  inference: OcrInference;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new OcrInference(serverResponse["inference"]);
  }
}
