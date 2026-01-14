import { StringDict } from "@/parsing/stringDict.js";
import { CommonResponse } from "@/v2/parsing/commonResponse.js";
import { CropInference } from "./cropInference.js";

export class CropResponse extends CommonResponse {
  /**
   * The inference result for a crop utility request.
   */
  public inference: CropInference;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new CropInference(serverResponse["inference"]);
  }
}
