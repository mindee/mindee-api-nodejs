import { MindeeError } from "@/errors/index.js";
import { errorHandler } from "@/errors/handler.js";
import { StringDict } from "@/parsing/stringDict.js";
import { BaseHttpResponse } from "../../http/apiCore.js";

export function handleError(
  urlName: string,
  response: BaseHttpResponse,
  serverError?: string
): void {
  let code;
  try {
    if (response.data.api_request["status_code"] === 200 && response.data?.job?.error?.code) {
      code = 500;
      response.data.api_request.error = response.data.job.error;
    } else if (response.data) {
      code = response.data.api_request["status_code"];
    }
  } catch {
    code = 500;
  }
  let errorObj: StringDict;
  try {
    //Regular instances where the returned error is in JSON format.
    errorObj = response.data.api_request.error;
  } catch {
    //Rare instances where errors are returned as HTML instead of JSON.
    if (!("reconstructedResponse" in response.data)) {
      response.data.reconstructedResponse = "";
    }
    if (response.data.reconstructedResponse.includes("Maximum pdf pages")) {
      errorObj = {
        message: "TooManyPages",
        details: "Maximum amount of pdf pages reached.",
      };
    } else if (response.data.reconstructedResponse.includes("Max file size is")) {
      errorObj = {
        message: "FileTooLarge",
        details: "Maximum file size reached.",
      };
    } else if (response.data.reconstructedResponse.includes("Invalid file type")) {
      errorObj = {
        message: "InvalidFiletype",
        details: "Invalid file type.",
      };
    } else if (response.data.reconstructedResponse.includes("Gateway timeout")) {
      errorObj = {
        message: "RequestTimeout",
        details: "Request timed out.",
      };
    } else if (response.data.reconstructedResponse.includes("Bad gateway")) {
      errorObj = {
        message: "BadRequest",
        details: "Bad Gateway",
      };
    } else if (response.data.reconstructedResponse.includes("Too Many Requests")) {
      errorObj = {
        message: "TooManyRequests",
        details: "Too Many Requests.",
      };
    } else {
      errorObj = {
        message: "Unknown Server Error.",
        details: response.data.reconstructedResponse,
      };
    }
  }
  if (serverError !== undefined &&
    (!("message" in errorObj) ||
      !errorObj.message ||
      errorObj.message.length === 0)
  ) {
    errorObj.message = serverError;
  }
  let errorToThrow;
  switch (code) {
  case 400:
    errorToThrow = new MindeeHttp400Error(errorObj, urlName, code);
    break;
  case 401:
    errorToThrow = new MindeeHttp401Error(errorObj, urlName, code);
    break;
  case 403:
    errorToThrow = new MindeeHttp403Error(errorObj, urlName, code);
    break;
  case 404:
    errorToThrow = new MindeeHttp404Error(errorObj, urlName, code);
    break;
  case 413:
    errorToThrow = new MindeeHttp413Error(errorObj, urlName, code);
    break;
  case 429:
    errorToThrow = new MindeeHttp429Error(errorObj, urlName, code);
    break;
  case 500:
    errorToThrow = new MindeeHttp500Error(errorObj, urlName, code);
    break;
  case 504:
    errorToThrow = new MindeeHttp504Error(errorObj, urlName, code);
    break;
  default:
    errorToThrow = new MindeeHttpErrorV1(errorObj, urlName, code);
    break;
  }
  errorHandler.throw(errorToThrow);
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
