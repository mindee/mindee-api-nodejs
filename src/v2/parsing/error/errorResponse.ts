import { StringDict } from "@/parsing/stringDict.js";
import { ErrorItem } from "./errorItem.js";
import { ErrorDetails } from "./errorDetails.js";

/**
 * Error response detailing a problem. The format adheres to RFC 9457.
 */
export class ErrorResponse implements ErrorDetails {
  status: number;
  detail: string;
  title: string;
  code: string;
  errors: ErrorItem[];

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
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
