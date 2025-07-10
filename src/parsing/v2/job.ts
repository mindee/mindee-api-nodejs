import { StringDict } from "../common";
import { ErrorResponse } from "./errorResponse";

/**
 * Job information for a V2 polling attempt.
 */
export class Job {
  /**
   * Job ID.
   */
  public id: string;

  /**
   * Error response if any.
   */
  public error?: ErrorResponse;
  /**
   * Timestamp of the job creation.
   */
  public createdAt: Date | null;
  /**
   * ID of the model.
   */
  public modelId: string;
  /**
   * Name for the file.
   */
  public filename: string;
  /**
   * Optional alias for the file.
   */
  public alias: string;
  /**
   * Status of the job.
   */
  public status: string;
  /**
   * URL to poll for the job status.
   */
  public pollingUrl: string;
  /**
   * URL to poll for the job result, redirects to the result if available.
   */
  public resultUrl?: string;
  /**
   * ID of webhooks associated with the job.
   */
  public webhooks: Array<string>;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    this.status = serverResponse["status"];
    if ("error" in serverResponse) {
      this.error = new ErrorResponse(serverResponse["error"]);
    }
    this.createdAt = serverResponse["created_at"] ? this.parseDate(serverResponse["created_at"]) : null;
    this.modelId = serverResponse["model_id"];
    this.pollingUrl = serverResponse["polling_url"];
    this.filename = serverResponse["filename"];
    this.resultUrl = serverResponse["result_url"];
    this.alias = serverResponse["alias"];
    this.webhooks = serverResponse["webhooks"];
  }

  private parseDate(dateString: string | null): Date | null {
    if (!dateString) return null;
    return new Date(dateString);
  }
}
