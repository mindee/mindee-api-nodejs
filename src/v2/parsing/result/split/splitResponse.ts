import { StringDict } from "@/parsing/stringDict.js";
import { BaseInferenceResponse } from "@/v2/parsing/result/baseInferenceResponse.js";
import { SplitInference } from "./splitInference.js";

export class SplitResponse extends BaseInferenceResponse<SplitInference> {

  setInferenceType(inferenceResponse: StringDict): SplitInference {
    return new SplitInference(inferenceResponse);
  }
}
