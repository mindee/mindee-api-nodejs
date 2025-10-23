import { StringDict } from "../common";

export class ErrorItem {
  /**
   * The HTTP status code returned by the server.
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
