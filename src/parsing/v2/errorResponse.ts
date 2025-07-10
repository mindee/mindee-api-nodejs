import { StringDict } from "../common";

export class ErrorResponse {
  /**
   * The HTTP code status.
   */
  public status: number;
  /**
   * The detail on the error.
   */
  public detail: string;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    this.status = serverResponse["status"];
    this.detail = serverResponse["detail"];
  }
}
