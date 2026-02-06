import { StringDict } from "@/parsing/stringDict.js";
import { SplitInference } from "./splitInference.js";
import { BaseResponse } from "@/v2/parsing/index.js";

export class SplitResponse extends BaseResponse {
  /**
   * Response for an OCR utility inference.
   */
  inference: SplitInference;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new SplitInference(serverResponse["inference"]);
  }
}
