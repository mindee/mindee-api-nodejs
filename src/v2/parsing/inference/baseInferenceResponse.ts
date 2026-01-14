import { StringDict } from "@/parsing/stringDict.js";
import { BaseResponse } from "@/v2/parsing/baseResponse.js";
import { BaseInference } from "./baseInference.js";

export abstract class BaseInferenceResponse extends BaseResponse {
  /**
   * The inference result for a crop utility request.
   */
  public inference: BaseInference;

  /**
   * @param serverResponse JSON response from the server.
   */
  protected constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = serverResponse["inference"];
  }
}
