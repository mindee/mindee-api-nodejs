import { StringDict } from "./stringDict";
/**
 * Holds the information relating to an API HTTP request.
 * 
 * @category API Response
 */
export class ApiRequest {
  /**  An object detailing the error. */
  error: StringDict;
  /** Target of the request. */
  resources: string[];
  /** Status of the request. Either "failure" or "success". */
  status: "failure" | "success";
  /** HTTP status code */
  statusCode: number;
  /** URL of the request. */
  url: string;

  constructor(serverResponse: StringDict) {
    this.error = serverResponse["error"];
    this.resources = serverResponse["resources"];
    this.status = serverResponse["status"];
    this.statusCode = serverResponse["status_code"];
    this.url = serverResponse["url"];
  }
}
