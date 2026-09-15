import { StringDict, parseDate } from "@/parsing/index.js";
import { ErrorResponse } from "@/v2/index.js";
import { JobWebhook } from "./jobWebhook.js";

/**
 * Job information for a V2 polling attempt.
 */
export class Job {
  /**
   * UUID of the Job.
   */
  public id: string;

  /**
   * If an error occurred during processing, contains the problem details.
   */
  public error?: ErrorResponse;
  /**
   * Date and time of the Job creation.
   */
  public createdAt: Date;
  /**
   * Date and time of the Job completion. Filled once processing is finished.
   */
  public completedAt: Date | null | undefined;
  /**
   * UUID of the model to be used for the inference.
   */
  public modelId: string;
  /**
   * Name of the file sent.
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
   * URL to retrieve the inference results. Will be filled once the inference is ready.
   */
  public resultUrl?: string;
  /**
   * List of responses from webhooks called. Empty until processing is finished.
   */
  public webhooks: Array<JobWebhook>;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    this.status = serverResponse["status"];
    if (serverResponse["error"]) {
      this.error = new ErrorResponse(serverResponse["error"]);
    }
    this.createdAt = parseDate(serverResponse["created_at"])!;
    if (!serverResponse["completed_at"]) {
      this.completedAt = undefined;
    } else {
      this.completedAt = parseDate(serverResponse["completed_at"]);
    }
    this.modelId = serverResponse["model_id"];
    this.pollingUrl = serverResponse["polling_url"];
    this.filename = serverResponse["filename"];
    this.resultUrl = serverResponse["result_url"];
    this.alias = serverResponse["alias"];
    this.webhooks = (serverResponse["webhooks"] ?? []).map(
      (webhook: StringDict) => new JobWebhook(webhook)
    );
  }
}
