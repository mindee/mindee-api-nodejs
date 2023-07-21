import { ApiResponse } from "./apiResponse";
import { Document, Inference, StringDict } from ".";

export class PredictResponse<T extends Inference> extends ApiResponse {
  document: Document<T>;

  constructor(
    inferenceClass: new (rawPrediction: StringDict) => T,
    rawPrediction: StringDict) {
    super(rawPrediction);
    this.document = new Document<T>(inferenceClass, rawPrediction["document"]);
  }
}
