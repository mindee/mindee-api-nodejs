import { ErrorDetails, ErrorItem, ErrorResponse } from "@/v2/parsing/index.js";
import { MindeeError } from "@/errors/index.js";

/**
 * HTTP error returned by the API.
 */
export class MindeeHttpErrorV2 extends MindeeError implements ErrorDetails {
  public status: number;
  public detail: string;
  public title: string;
  public code: string;
  public errors: ErrorItem[];

  constructor(error: ErrorResponse) {
    super(`HTTP ${error.status} - ${error.title} :: ${error.code} - ${error.detail}`);
    this.status = error.status;
    this.detail = error.detail;
    this.title = error.title;
    this.code = error.code;
    this.errors = error.errors;
    this.name = "MindeeHttpErrorV2";
  }
}
