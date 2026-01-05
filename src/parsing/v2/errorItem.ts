import { StringDict } from "@/parsing/common/stringDict.js";

/**
 * Explicit details on a problem.
 */
export class ErrorItem {
  /**
   * A JSON Pointer to the location of the body property.
   */
  public pointer?: string;
  /**
   * Explicit information on the issue.
   */
  public detail: string;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    if (serverResponse["pointer"] !== undefined) {
      this.pointer = serverResponse["pointer"];
    }
    this.detail = serverResponse["detail"];
  }
}
