import { StringDict } from "@/parsing/stringDict.js";
import { BaseResponse } from "@/v2/parsing/baseResponse.js";
import { BaseInference } from "./baseInference.js";

export abstract class BaseInferenceResponse<T extends BaseInference> extends BaseResponse {
  /**
   * The inference result for a crop utility request.
   */
  public inference: T;

  /**
   * @param serverResponse JSON response from the server.
   */
  protected constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = this.setInferenceType(serverResponse["inference"]);
  }

  public abstract setInferenceType(inferenceResponse: StringDict): T;
}

export type InferenceResponseConstructor<T extends BaseInference> = new (serverResponse: StringDict) => T;
