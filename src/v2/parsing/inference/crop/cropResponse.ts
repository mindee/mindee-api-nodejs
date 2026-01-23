import { StringDict } from "@/parsing/stringDict.js";
import { CropInference } from "./cropInference.js";
import { BaseInferenceResponse } from "@/v2/parsing/inference/baseInferenceResponse.js";

export class CropResponse extends BaseInferenceResponse<CropInference> {

  setInferenceType(inferenceResponse: StringDict): CropInference {
    return new CropInference(inferenceResponse);
  }
}
