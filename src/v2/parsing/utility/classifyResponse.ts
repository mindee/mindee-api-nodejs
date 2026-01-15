import { StringDict } from "@/parsing/stringDict.js";
import { BaseInferenceResponse } from "@/v2/parsing/baseInferenceResponse.js";

export class ClassifyResponse extends BaseInferenceResponse {

  constructor(serverResponse: StringDict) {
    super(serverResponse);
  }
}
