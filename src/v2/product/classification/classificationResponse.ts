import { StringDict } from "@/parsing/stringDict.js";
import { ClassificationInference } from "./classificationInference.js";
import { BaseResponse } from "@/v2/parsing/index.js";

export class ClassificationResponse extends BaseResponse {
  /**
   * The inference result for a classification utility request.
   */
  inference: ClassificationInference;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.inference = new ClassificationInference(serverResponse["inference"]);
  }
}
