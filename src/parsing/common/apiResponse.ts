import { ApiRequest } from "./apiRequest";
import { StringDict } from "./stringDict";

export abstract class ApiResponse {
  apiRequest: ApiRequest;

  constructor(serverResponse: StringDict) {
    this.apiRequest = new ApiRequest(serverResponse["api_request"]);
  }
}
