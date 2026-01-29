import { StringDict } from "@/parsing/stringDict.js";
import { BaseInferenceResponse } from "@/v2/parsing/result/index.js";
import { ClassificationInference } from "./classificationInference.js";

export class ClassificationResponse extends BaseInferenceResponse<ClassificationInference> {

  setInferenceType(inferenceResponse: StringDict): ClassificationInference {
    return new ClassificationInference(inferenceResponse);
  }
}
