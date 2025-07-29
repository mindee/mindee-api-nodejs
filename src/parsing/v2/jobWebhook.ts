import { ErrorResponse } from "./errorResponse";
import { StringDict, parseDate } from "../common";

/**
 * JobWebhook information.
 */
export class JobWebhook {
  /**
   * JobWebhook ID.
   */
  public id: string;
  /**
   * Created at date.
   */
  public createdAt: Date | null;
  /**
   * Status of the webhook.
   */
  public status: string;
  /**
   * Error response, if any.
   */
  public error?: ErrorResponse;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    this.createdAt = parseDate(serverResponse["created_at"]);
    this.status = serverResponse["status"];
    if (serverResponse["error"] !== undefined) {
      this.error = new ErrorResponse(serverResponse["error"]);
    }
  }
}
