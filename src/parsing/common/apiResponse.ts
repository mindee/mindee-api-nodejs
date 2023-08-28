import { ApiRequest } from "./apiRequest";
import { StringDict } from "./stringDict";


/** Base wrapper for API requests.
 * 
 * @category API Response
*/
export abstract class ApiResponse {
  /** Initial request sent to the API. */
  apiRequest: ApiRequest;
  /** Raw text representation of the API's response. */
  private readonly rawHttp: StringDict;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    this.apiRequest = new ApiRequest(serverResponse["api_request"]);
    this.rawHttp = serverResponse;
  }

  /**
   * Raw HTTP request sent from server, as a JSON-like structure
   * @returns The HTTP request
   */
  getRawHttp():StringDict {
    return this.rawHttp;
  }
}
