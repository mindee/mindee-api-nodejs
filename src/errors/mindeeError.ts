import { ErrorDetails, ErrorResponse } from "../parsing/v2";

/**
 * Main Mindee Error custom class.
 */
export class MindeeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MindeeError";
  }
}

/**
 * Custom Mindee error relating to improper mimetypes in inputs.
 */
export class MindeeMimeTypeError extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeeMimeTypeError";
  }
}


export class MindeeImageError extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeeImageError";
  }
}

export class MindeePdfError extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeePdfError";
  }
}

export class MindeeApiV2Error extends MindeeError {
  constructor(message: string) {
    super(message);
    this.name = "MindeeApiV2Error";
  }
}

export class MindeeHttpErrorV2 extends MindeeError implements ErrorDetails {
  public status: number;
  public detail: string;
  public title: string;
  public code: string;

  constructor(error: ErrorResponse) {
    super(`HTTP ${error.status} :: ${error.title} - ${error.detail}`);
    this.status = error.status;
    this.detail = error.detail;
    this.title = error.title;
    this.code = error.code;
    this.name = "MindeeHttpErrorV2";
  }
}
