import { ApiResponse } from "./apiResponse.js";
import { Document } from "./document.js";
import { Inference } from "./inference.js";
import { StringDict } from "../../../parsing/stringDict.js";

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
   * @param serverResponse raw http response.
   */
  constructor(
    inferenceClass: new (serverResponse: StringDict) => T,
    serverResponse: StringDict
  ) {
    super(serverResponse);
    this.document = new Document<T>(inferenceClass, serverResponse["document"]);
  }
}
