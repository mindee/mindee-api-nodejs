import { EndpointResponse } from "./baseEndpoint";


export function isValidSyncResponse(response: EndpointResponse): boolean {
  if (!response.messageObj || !response.messageObj.statusCode) {
    return false;
  }
  return !(isNaN(response.messageObj.statusCode) || parseInt(response.messageObj.statusCode.toString()) < 200 || parseInt(response.messageObj.statusCode.toString()) > 302);

}

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
  return !(response.data["job"] && response.data["job"]["error"] && Object.keys(response.data["job"]["error"]).length > 0);
}

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
    if (response.data["api_request"] && response.data["api_request"]["status_code"] && parseInt(response.data["api_request"]["status_code"].toString()) > 399) {
      response.messageObj.statusCode = parseInt(response.data["api_request"]["status_code"].toString());
    }
    if (response.data["job"] && response.data["job"]["error"] && response.data["job"]["error"]["status_code"]) {
      if (response.data["job"]["error"]["status_code"]) {
        const errorCode = parseInt(response.data["job"]["error"]["status_code"].toString());
        if (errorCode >= 400) {
          response.messageObj.statusCode = errorCode;
        }
      }
    }
  }
  return response;
}
