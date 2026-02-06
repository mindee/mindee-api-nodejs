import { StringDict } from "@/parsing/stringDict.js";
import { ErrorItem } from "./errorItem.js";
import { ErrorDetails } from "./errorDetails.js";
import { BaseResponse } from "@/v2/parsing/baseResponse.js";

/**
 * Error response detailing a problem. The format adheres to RFC 9457.
 */
export class ErrorResponse extends BaseResponse implements ErrorDetails {
  status: number;
  detail: string;
  title: string;
  code: string;
  errors: ErrorItem[];

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.status = serverResponse["status"];
    this.detail = serverResponse["detail"];
    this.title = serverResponse["title"];
    this.code = serverResponse["code"];
    if (serverResponse["errors"] !== undefined) {
      this.errors = serverResponse["errors"].map(
        (error: StringDict) => new ErrorItem(error)
      );
    } else {
      this.errors = [];
    }
  }
}
