import { ApiResponse } from "./apiResponse";
import { Document, Inference, StringDict } from ".";

/** Wrapper for synchronous prediction response.
 * 
 * @category API Response
 * @category Synchronous
 */
export class PredictResponse<T extends Inference> extends ApiResponse {
  /** A document prediction response. */
  document: Document<T>;

  /**
   * 
   * @param inferenceClass constructor signature for an inference.
   * @param rawPrediction raw http response.
   */
  constructor(
    inferenceClass: new (rawPrediction: StringDict) => T,
    rawPrediction: StringDict
  ) {
    super(rawPrediction);
    this.document = new Document<T>(inferenceClass, rawPrediction["document"]);
  }
}
