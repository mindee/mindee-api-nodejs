import { ApiResponse } from "./apiResponse";
import { StringDict } from "./stringDict";
import { Inference } from "./inference";
import { Document } from "./document";

/** Wrapper for asynchronous request queues. Holds information regarding a job (queue).
 *
 * @category API Response
 * @category Asynchronous
 */
export class Job {
  /** Timestamp noting the enqueueing of a document. */
  issuedAt: Date;
  /** Timestamp noting the availability of a prediction for an enqueued document. */
  availableAt?: Date;
  /** Information about an error that occurred during the job processing. */
  error?: StringDict;
  /** ID of the job. */
  id: string;
  /** Status of the job. */
  status?: "waiting" | "processing" | "completed" | "failed";
  /** The time taken to process the job, in milliseconds. */
  milliSecsTaken?: number;

  constructor(jsonResponse: StringDict) {
    this.issuedAt = datetimeWithTimezone(jsonResponse["issued_at"]);
    if (
      jsonResponse["available_at"] !== undefined &&
      jsonResponse["available_at"] !== null
    ) {
      this.availableAt = datetimeWithTimezone(
        jsonResponse["available_at"]
      );
    }
    this.id = jsonResponse["id"];
    this.status = jsonResponse["status"];
    if (this.availableAt !== undefined) {
      this.milliSecsTaken =
        this.availableAt.getTime() - this.issuedAt.getTime();
    }
  }
}

// Hideous thing to make sure dates sent back by the server are parsed correctly in UTC.
export function datetimeWithTimezone(date: string): Date {
  if (date.search(/\+[0-9]{2}:[0-9]{2}$/) === -1) {
    date += "+00:00";
  }
  return new Date(date);
}

/** Wrapper for asynchronous jobs and parsing results.
 *
 * @category API Response
 * @category Asynchronous
 */
export class AsyncPredictResponse<T extends Inference> extends ApiResponse {
  /** Job for a queue. */
  job: Job;
  /** Prediction for an asynchronous request. Will not be available so long as the job is not
   * `completed`.
   */
  document?: Document<T>;

  /**
   *
   * @param inferenceClass constructor signature for an inference.
   * @param serverResponse raw http response.
   */
  constructor(
    inferenceClass: new (httpResponse: StringDict) => T,
    serverResponse: StringDict
  ) {
    super(serverResponse);
    this.job = new Job(serverResponse["job"]);
    this.document =
      serverResponse["document"] !== undefined
        ? new Document<T>(inferenceClass, serverResponse["document"])
        : undefined;
  }
}
