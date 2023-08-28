import { errorHandler } from "../errors/handler";
import { StringDict } from "../parsing/common";
import { EndpointResponse } from "./endpoint";

export function handleError(
  url: string,
  response: EndpointResponse,
) {
  const errorObj: StringDict = response.data?.api_request;
  let errorToThrow;
  switch (errorObj["statusCode"]) {
    case 400:
      errorToThrow = new MindeeHttpError400(errorObj, url);
      break;
    case 401:
      errorToThrow = new MindeeHttpError401(errorObj, url);
      break;
    case 403:
      errorToThrow = new MindeeHttpError403(errorObj, url);
      break;
    case 404:
      errorToThrow = new MindeeHttpError404(errorObj, url);
      break;
    case 413:
      errorToThrow = new MindeeHttpError413(errorObj, url);
      break;
    case 429:
      errorToThrow = new MindeeHttpError429(errorObj, url);
      break;
    case 500:
      errorToThrow = new MindeeHttpError500(errorObj, url);
      break;
    case 504:
      errorToThrow = new MindeeHttpError504(errorObj, url);
      break;
    default:
      errorToThrow = new MindeeHttpError(errorObj, url);
      break;
  }
  errorHandler.throw(errorToThrow);
}

/**
 * Error wrapper for server errors 
 */
export class MindeeHttpError extends Error {
  message: string;
  details: string;
  code: number;
  constructor(rawHttpError: StringDict, url: string) {
    super(`${url} API ${rawHttpError["status_code"]} HTTP error:
Message: ${rawHttpError["error"]["message"]}
Details: ${rawHttpError["error"]["details"]}`);
    this.message = rawHttpError["error"]["message"];
    this.details = rawHttpError["error"]["details"];
    this.code = rawHttpError["status_code"];
  }
}

export class MindeeHttpError400 extends MindeeHttpError {

  constructor(rawHttpError: StringDict, url: string) {
    super(rawHttpError, url);
  }
}

export class MindeeHttpError401 extends MindeeHttpError {

  constructor(rawHttpError: StringDict, url: string) {
    super(rawHttpError, url);
  }
}

export class MindeeHttpError403 extends MindeeHttpError {

  constructor(rawHttpError: StringDict, url: string) {
    super(rawHttpError, url);
  }
}

export class MindeeHttpError404 extends MindeeHttpError {

  constructor(rawHttpError: StringDict, url: string) {
    super(rawHttpError, url);
  }
}

export class MindeeHttpError413 extends MindeeHttpError {

  constructor(rawHttpError: StringDict, url: string) {
    super(rawHttpError, url);
  }
}

export class MindeeHttpError429 extends MindeeHttpError {

  constructor(rawHttpError: StringDict, url: string) {
    super(rawHttpError, url);
  }
}

export class MindeeHttpError500 extends MindeeHttpError {

  constructor(rawHttpError: StringDict, url: string) {
    super(rawHttpError, url);
  }
}
export class MindeeHttpError504 extends MindeeHttpError {

  constructor(rawHttpError: StringDict, url: string) {
    super(rawHttpError, url);
  }
}

