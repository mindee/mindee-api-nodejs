import { MindeeError } from "../errors";
import { errorHandler } from "../errors/handler";
import { StringDict } from "../parsing/common";
import { EndpointResponse } from "./endpoint";

export function handleError(
  url: string,
  response: EndpointResponse,
  code?: number,
  serverError?: string
) {
  if (code === undefined) {
    throw new MindeeHttpError({ message: "Missing HTTP Error code.", details: response.data, undefined }, url);
  }
  let errorObj: StringDict;
  try {
    //Regular instances where the returned error is in JSON format.
    errorObj = response.data.api_request.error;
  } catch (err) {
    //Rare instances where errors are returned as HTML instead of JSON.
    if (!("reconstructedResponse" in response.data)){
      response.data.reconstructedResponse = ""
    }
    if (response.data.reconstructedResponse.includes("Maximum pdf pages")) {
      errorObj = {
        message: "TooManyPages",
        details: "Maximum amount of pdf pages reached.",
      }
    } else if (response.data.reconstructedResponse.includes("Max file size is")) {
      errorObj = {
        message: "FileTooLarge",
        details: "Maximum file size reached.",
      }
    } else if (response.data.reconstructedResponse.includes("Invalid file type")) {
      errorObj = {
        message: "InvalidFiletype",
        details: "Invalid file type.",
      }
    } else if (response.data.reconstructedResponse.includes("Gateway timeout")) {
      errorObj = {
        message: "RequestTimeout",
        details: "Request timed out.",
      }
    } else if (response.data.reconstructedResponse.includes("Bad gateway")) {
      errorObj = {
        message: "BadRequest",
        details: "Bad Gateway",
      }
    } else if (response.data.reconstructedResponse.includes("Too Many Requests")) {
      errorObj = {
        message: "TooManyRequests",
        details: "Too Many Requests.",
      }
    } else {
      errorObj = {
        message: "Unknown Server Error.",
        details: response.data.reconstructedResponse,
      }
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
    errorToThrow = new MindeeHttpError400(errorObj, url, code);
    break;
  case 401:
    errorToThrow = new MindeeHttpError401(errorObj, url, code);
    break;
  case 403:
    errorToThrow = new MindeeHttpError403(errorObj, url, code);
    break;
  case 404:
    errorToThrow = new MindeeHttpError404(errorObj, url, code);
    break;
  case 413:
    errorToThrow = new MindeeHttpError413(errorObj, url, code);
    break;
  case 429:
    errorToThrow = new MindeeHttpError429(errorObj, url, code);
    break;
  case 500:
    errorToThrow = new MindeeHttpError500(errorObj, url, code);
    break;
  case 504:
    errorToThrow = new MindeeHttpError504(errorObj, url, code);
    break;
  default:
    errorToThrow = new MindeeHttpError(errorObj, url, code);
    break;
  }
  errorHandler.throw(errorToThrow);
}

/**
 * `Error` wrapper for server (HTTP) errors.
 * Is used when an error is lacking a handled error code.
 */
export class MindeeHttpError extends MindeeError {
  /** Description of the error. */
  message: string = "";
  /** Additional details on the error. */
  details: string | StringDict = "";
  /** Standard HTTP error code. */
  code?: number;

  constructor(httpError: StringDict, url: string, code?: number) {
    super(`${url} API ${code} HTTP error: ${httpError.message}`);
    this.details ??= httpError?.details;
    this.message ??= httpError?.message;
    this.code = code;
    this.name = "MindeeHttpError";
  }
}

/**
 * Generic client errors.
 * Can include errors like InvalidQuery.
 */
export class MindeeHttpError400 extends MindeeHttpError {
  constructor(httpError: StringDict, url: string, code?: number) {
    super(httpError, url, code);
  }
}

/**
 * Can include errors like NoTokenSet or InvalidToken.
 */
export class MindeeHttpError401 extends MindeeHttpError {
  constructor(httpError: StringDict, url: string, code?: number) {
    super(httpError, url, code);
  }
}

/**
 * Regular AccessForbidden error.
 * Can also include errors like PlanLimitReached, AsyncRequestDisallowed or SyncRequestDisallowed.
 */
export class MindeeHttpError403 extends MindeeHttpError {
  constructor(httpError: StringDict, url: string, code?: number) {
    super(httpError, url, code);
  }
}

export class MindeeHttpError404 extends MindeeHttpError {
  constructor(httpError: StringDict, url: string, code?: number) {
    super(httpError, url, code);
  }
}

/** 
 * Rare error.
 * Can occasionally happen when unusually large documents are passed.
 */
export class MindeeHttpError413 extends MindeeHttpError {
  constructor(httpError: StringDict, url: string, code?: number) {
    super(httpError, url, code);
  }
}

/**
 * Usually contains TooManyRequests errors.
 * Arises whenever too many calls to the API are made in quick succession.
 */
export class MindeeHttpError429 extends MindeeHttpError {
  constructor(httpError: StringDict, url: string, code?: number) {
    super(httpError, url, code);
  }
}

/**
 * Generic server errors.
 */
export class MindeeHttpError500 extends MindeeHttpError {
  constructor(httpError: StringDict, url: string, code?: number) {
    super(httpError, url, code);
  }
}

/**
 * Miscellaneous server errors.
 * Can include errors like RequestTimeout or GatewayTimeout.
 */
export class MindeeHttpError504 extends MindeeHttpError {
  constructor(httpError: StringDict, url: string, code?: number) {
    super(httpError, url, code);
  }
}
