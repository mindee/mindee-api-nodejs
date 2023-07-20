import { ApiResponse } from "./apiResponse";
import { StringDict } from "./stringDict";
import { Inference } from "./inference";
import { Document } from "./document";

export class Job {
  issuedAt: Date;
  availableAt?: Date;
  id?: string;
  status?: "waiting" | "processing" | "completed";
  /**
   * The time taken to process the job, in milliseconds.
   */
  milliSecsTaken?: number;

  constructor(jsonResponse: StringDict) {
    this.issuedAt = this.datetimeWithTimezone(jsonResponse["issued_at"]);
    if (
      jsonResponse["available_at"] !== undefined &&
      jsonResponse["available_at"] !== null
    ) {
      this.availableAt = this.datetimeWithTimezone(
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

  // Hideous thing to make sure dates sent back by the server are parsed correctly in UTC.
  protected datetimeWithTimezone(date: string): Date {
    if (date.search(/\+[0-9]{2}:[0-9]{2}$/) === -1) {
      date += "+00:00";
    }
    return new Date(date);
  }
}

export class AsyncPredictResponse<T extends Inference> extends ApiResponse {
  job: Job;
  document?: Document<T>;

  constructor(
    inferenceClass: new (httpResponse: StringDict) => T,
    httpResponse: StringDict) {
    super(httpResponse);
    this.job = new Job(httpResponse["job"]);
    this.document = httpResponse.hasOwnProperty("document") ? new Document<T>(inferenceClass, httpResponse["document"]) : undefined;
  }
}
