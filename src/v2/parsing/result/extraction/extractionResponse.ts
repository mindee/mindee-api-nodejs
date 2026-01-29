import { ExtractionInference } from "./extractionInference.js";
import { StringDict } from "@/parsing/stringDict.js";
import { BaseInferenceResponse } from "@/v2/parsing/result/baseInferenceResponse.js";

export class ExtractionResponse extends BaseInferenceResponse<ExtractionInference> {

  setInferenceType(inferenceResponse: StringDict): ExtractionInference {
    return new ExtractionInference(inferenceResponse);
  }
}
