import { StringDict } from "@/parsing/stringDict.js";
import { BaseInferenceResponse } from "@/v2/parsing/result/baseInferenceResponse.js";
import { OcrInference } from "./ocrInference.js";

export class OcrResponse extends BaseInferenceResponse<OcrInference> {

  setInferenceType(inferenceResponse: StringDict): OcrInference {
    return new OcrInference(inferenceResponse);
  }
}
