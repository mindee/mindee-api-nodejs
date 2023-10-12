import { ApiResponse } from "../apiResponse";
import { StringDict } from "../stringDict";

/**
 * Wrapper for feedback response.
 * @category API Response
 * @category Synchronous
 */
export class FeedbackResponse extends ApiResponse {
  /** A document feedback response. */
  feedback: StringDict;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(
    serverResponse: StringDict
  ) {
    super(serverResponse);
    this.feedback = serverResponse["feedback"];
  }
}
