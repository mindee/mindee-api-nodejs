import { ApiRequest } from "./apiRequest";
import { StringDict } from "./stringDict";


/** Base wrapper for API requests.
 * 
 * @category API Response
*/
export abstract class ApiResponse {
  /** Initial request sent to the API. */
  apiRequest: ApiRequest;

  /**
   * 
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    this.apiRequest = new ApiRequest(serverResponse["api_request"]);
  }
}
