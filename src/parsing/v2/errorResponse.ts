import { StringDict } from "../common";
import { ErrorItem } from "./errorItem";

export interface ErrorDetails {
  /**
   * The HTTP status code returned by the server.
   */
  status: number;
  /**
   * A human-readable explanation specific to the occurrence of the problem.
   */
  detail: string;
  /**
   * A short, human-readable summary of the problem.
   */
  title: string;
  /**
   * A machine-readable code specific to the occurrence of the problem.
   */
  code: string;
}

/**
 * Error response detailing a problem. The format adheres to RFC 9457.
 */
export class ErrorResponse implements ErrorDetails {
  status: number;
  detail: string;
  title: string;
  code: string;
  /**
   * A machine-readable code specific to the occurrence of the problem.
   */
  public errors: ErrorItem[];

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
