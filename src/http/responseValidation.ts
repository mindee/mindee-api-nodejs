import { EndpointResponse } from "./apiCore.js";

/**
 * Checks if the synchronous response is valid. Returns True if the response is valid.
 *
 * @param response an endpoint response object.
 * @returns bool
 */
export function isValidSyncResponse(response: EndpointResponse): boolean {
  if (!response.messageObj || !response.messageObj.statusCode) {
    return false;
  }
  if (
    response.data &&
    response.data["api_request"] &&
    response.data["api_request"]["status_code"] &&
    response.data["api_request"]["status_code"] > 399
  ) {
    return false;
  }
  return !(
    isNaN(response.messageObj.statusCode) ||
    parseInt(response.messageObj.statusCode.toString()) < 200 ||
    parseInt(response.messageObj.statusCode.toString()) > 302
  );

}

/**
 * Checks if the asynchronous response is valid. Also checks if it is a valid synchronous response.
 * Returns True if the response is valid.
 *
 * @param response an endpoint response object.
 * @returns bool
 */
export function isValidAsyncResponse(response: EndpointResponse): boolean {
  if (!isValidSyncResponse(response)) {
    return false;
  }
  if (response.messageObj.statusCode) {
    if (response.messageObj.statusCode >= 300 && response.messageObj.statusCode <= 302) {
      // Skip next check for redirections as the final payload will be checked anyway.
      return true;
    } else if (response.messageObj.statusCode < 200 || response.messageObj.statusCode > 302) {
      return false;
    }
  }
  if (!response.data["job"]) {
    return false;
  }
  return !(
    response.data["job"] &&
    response.data["job"]["error"] &&
    Object.keys(response.data["job"]["error"]).length > 0
  );
}

/**
 * Checks and correct the response object depending on the possible kinds of returns.
 *
 * @param response an endpoint response object.
 * @returns EndpointResponse Returns the job error if the error is due to parsing, returns the http error otherwise.
 */
export function cleanRequestData(response: EndpointResponse): EndpointResponse {
  if (response.messageObj &&
    response.messageObj.statusCode &&
    (
      response.messageObj.statusCode < 200 ||
      response.messageObj.statusCode > 302)
  ) {
    return response;
  }
  if (response.data) {
    if (
      response.data["api_request"] &&
      response.data["api_request"]["status_code"] &&
      parseInt(response.data["api_request"]["status_code"].toString()) > 399
    ) {
      response.messageObj.statusCode = parseInt(response.data["api_request"]["status_code"].toString());
    }
    if (
      response.data["job"] && response.data["job"]["error"] &&
      Object.keys(response.data["job"]["error"]).length > 0
    ) {
      response.messageObj.statusCode = 500;
    }
  }
  return response;
}
