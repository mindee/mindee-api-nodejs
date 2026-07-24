import { MindeeError } from "@/errors/index.js";
import { errorHandler } from "@/errors/handler.js";
import { StringDict } from "@/parsing/stringDict.js";
import { BaseHttpResponse } from "../../http/apiCore.js";

const HTML_ERROR_PATTERNS: ReadonlyArray<[string, StringDict]> = [
  ["Maximum pdf pages", { message: "TooManyPages", details: "Maximum amount of pdf pages reached." }],
  ["Max file size is", { message: "FileTooLarge", details: "Maximum file size reached." }],
  ["Invalid file type", { message: "InvalidFiletype", details: "Invalid file type." }],
  ["Gateway timeout", { message: "RequestTimeout", details: "Request timed out." }],
  ["Bad gateway", { message: "BadRequest", details: "Bad Gateway" }],
  ["Too Many Requests", { message: "TooManyRequests", details: "Too Many Requests." }],
];

const ERROR_CLASSES_BY_CODE = new Map<number, typeof MindeeHttpErrorV1>();

function extractStatusCode(response: BaseHttpResponse): number | undefined {
  try {
    if (response.data.api_request["status_code"] === 200 && response.data?.job?.error?.code) {
      response.data.api_request.error = response.data.job.error;
      return 500;
    }
    if (response.data) {
      return response.data.api_request["status_code"];
    }
  } catch {
    return 500;
  }
  return undefined;
}

function errorObjFromHtml(reconstructed: string): StringDict {
  for (const [needle, obj] of HTML_ERROR_PATTERNS) {
    if (reconstructed.includes(needle)) {
      return { ...obj };
    }
  }
  return { message: "Unknown Server Error.", details: reconstructed };
}

function extractErrorObj(response: BaseHttpResponse): StringDict {
  try {
    // Regular instances where the returned error is in JSON format.
    return response.data.api_request.error;
  } catch {
    // Rare instances where errors are returned as HTML instead of JSON.
    if (!("reconstructedResponse" in response.data)) {
      response.data.reconstructedResponse = "";
    }
    return errorObjFromHtml(response.data.reconstructedResponse);
  }
}

export function handleError(
  urlName: string,
  response: BaseHttpResponse,
  serverError?: string
): void {
  const code = extractStatusCode(response);
  const errorObj = extractErrorObj(response);

  if (
    serverError !== undefined &&
    (!("message" in errorObj) || !errorObj.message || errorObj.message.length === 0)
  ) {
    errorObj.message = serverError;
  }

  const errorClass = (code !== undefined && ERROR_CLASSES_BY_CODE.get(code)) || MindeeHttpErrorV1;
  errorHandler.throw(new errorClass(errorObj, urlName, code));
}

/**
 * `Error` wrapper for server (HTTP) errors.
 * Is used when an error is lacking a handled error code.
 */
export class MindeeHttpErrorV1 extends MindeeError {
  /** Description of the error. */
  message: string = "";
  /** Additional details on the error. */
  details: string | StringDict = "";
  /** Standard HTTP error code. */
  code?: number;

  constructor(httpError: StringDict, urlName: string, code?: number) {
    super(`${urlName} API ${code} HTTP error: ${httpError.message}`);
    this.details = httpError.details;
    this.message = httpError.message;
    this.code = code;
    this.name = "MindeeHttpError";
  }
}

/**
 * Generic client errors.
 * Can include errors like InvalidQuery.
 */
export class MindeeHttp400Error extends MindeeHttpErrorV1 {
  constructor(httpError: StringDict, urlName: string, code?: number) {
    super(httpError, urlName, code);
    this.name = "MindeeHttp400Error";
  }
}

/**
 * Can include errors like NoTokenSet or InvalidToken.
 */
export class MindeeHttp401Error extends MindeeHttpErrorV1 {
  constructor(httpError: StringDict, urlName: string, code?: number) {
    super(httpError, urlName, code);
    this.name = "MindeeHttp401Error";
  }
}

/**
 * Regular AccessForbidden error.
 * Can also include errors like PlanLimitReached, AsyncRequestDisallowed or SyncRequestDisallowed.
 */
export class MindeeHttp403Error extends MindeeHttpErrorV1 {
  constructor(httpError: StringDict, urlName: string, code?: number) {
    super(httpError, urlName, code);
    this.name = "MindeeHttp403Error";
  }
}

export class MindeeHttp404Error extends MindeeHttpErrorV1 {
  constructor(httpError: StringDict, urlName: string, code?: number) {
    super(httpError, urlName, code);
    this.name = "MindeeHttp404Error";
  }
}

/**
 * Rare error.
 * Can occasionally happen when unusually large documents are passed.
 */
export class MindeeHttp413Error extends MindeeHttpErrorV1 {
  constructor(httpError: StringDict, urlName: string, code?: number) {
    super(httpError, urlName, code);
    this.name = "MindeeHttp413Error";
  }
}

/**
 * Usually corresponds to TooManyRequests errors.
 * Arises whenever too many calls to the API are made in quick succession.
 */
export class MindeeHttp429Error extends MindeeHttpErrorV1 {
  constructor(httpError: StringDict, urlName: string, code?: number) {
    super(httpError, urlName, code);
    this.name = "MindeeHttp429Error";
  }
}

/**
 * Generic server errors.
 */
export class MindeeHttp500Error extends MindeeHttpErrorV1 {
  constructor(httpError: StringDict, urlName: string, code?: number) {
    super(httpError, urlName, code);
    this.name = "MindeeHttp500Error";
  }
}

/**
 * Miscellaneous server errors.
 * Can include errors like RequestTimeout or GatewayTimeout.
 */
export class MindeeHttp504Error extends MindeeHttpErrorV1 {
  constructor(httpError: StringDict, urlName: string, code?: number) {
    super(httpError, urlName, code);
    this.name = "MindeeHttp504Error";
  }
}

ERROR_CLASSES_BY_CODE.set(400, MindeeHttp400Error);
ERROR_CLASSES_BY_CODE.set(401, MindeeHttp401Error);
ERROR_CLASSES_BY_CODE.set(403, MindeeHttp403Error);
ERROR_CLASSES_BY_CODE.set(404, MindeeHttp404Error);
ERROR_CLASSES_BY_CODE.set(413, MindeeHttp413Error);
ERROR_CLASSES_BY_CODE.set(429, MindeeHttp429Error);
ERROR_CLASSES_BY_CODE.set(500, MindeeHttp500Error);
ERROR_CLASSES_BY_CODE.set(504, MindeeHttp504Error);
