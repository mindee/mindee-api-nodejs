import { StringDict } from "@/parsing/stringDict.js";
import { CropInference } from "./cropInference.js";
import { BaseResponse } from "@/v2/parsing/index.js";

export class CropResponse extends BaseResponse {
  /**
   * Response for a crop utility inference.
   */
  inference: CropInference;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new CropInference(serverResponse["inference"]);
  }
}
