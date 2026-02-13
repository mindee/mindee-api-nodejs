import { StringDict, parseDate } from "@/parsing/index.js";
import { ErrorResponse } from "@/v2/index.js";
import { JobWebhook } from "./jobWebhook.js";

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
  public status?: string;
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
  public webhooks: Array<JobWebhook>;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    if (serverResponse["status"] !== undefined) {
      this.status = serverResponse["status"];
    }
    if (
      serverResponse["error"] !== undefined &&
      serverResponse["error"] !== null &&
      Object.keys(serverResponse["error"]).length > 0
    ) {
      this.error = new ErrorResponse(serverResponse["error"]);
    }
    this.createdAt = parseDate(serverResponse["created_at"]);
    this.modelId = serverResponse["model_id"];
    this.pollingUrl = serverResponse["polling_url"];
    this.filename = serverResponse["filename"];
    this.resultUrl = serverResponse["result_url"];
    this.alias = serverResponse["alias"];
    this.webhooks = serverResponse["webhooks"];
  }
}
