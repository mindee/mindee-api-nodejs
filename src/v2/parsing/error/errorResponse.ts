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

  /**
   * To make the error prettier to display.
   */
  public toString(): string {
    const result: string[] = [];

    result.push("Error Details");
    result.push("=============");
    result.push(`:HTTP Status: ${this.status}`);
    result.push(`:Title: ${this.title}`);
    result.push(`:Code: ${this.code}`);
    result.push(`:Detail: ${this.detail}`);

    if (this.errors && this.errors.length > 0) {
      result.push("");
      result.push("Error Items");
      result.push("-----------");

      this.errors.forEach((error, i) => {
        result.push(`**Error ${i + 1}:**`);
        result.push(`  :Pointer: ${error.pointer}`);
        result.push(`  :Detail: ${error.detail}`);

        if (i < this.errors.length - 1) {
          result.push("");
        }
      });
    }

    return result.join("\n") + "\n";
  }
}
