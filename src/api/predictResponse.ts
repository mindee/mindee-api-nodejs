import { StringDict } from "../fields";
import { Document } from "../documents";
import { Response } from "./documentResponse";

export class Job {
  issuedAt: Date;
  availableAt?: Date;
  id?: string;
  status?: "processing" | "waiting";

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
  }

  /** Hideous thing to make sure dates sent back by the server are parsed correctly in UTC. */
  protected datetimeWithTimezone(date: string): Date {
    if (date.search(/\+[0-9]{2}:[0-9]{2}$/) === -1) {
      date += "+00:00";
    }
    return new Date(date);
  }
}

export class ApiRequest {
  error: StringDict;
  resources: string[];
  status: "failure" | "success";
  /** HTTP status code */
  statusCode: number;
  url: string;

  constructor(serverResponse: StringDict) {
    this.error = serverResponse["error"];
    this.resources = serverResponse["resources"];
    this.status = serverResponse["status"];
    this.statusCode = serverResponse["status_code"];
    this.url = serverResponse["url"];
  }
}

// For upcoming v4, use this as the base for all responses.
// To not break compatibility, in v3.x, we will only use it as the base for async responses.
export class BasePredictResponse<DocType extends Document> {
  apiRequest: ApiRequest;

  constructor(serverResponse: StringDict) {
    this.apiRequest = new ApiRequest(serverResponse["api_request"]);
  }
}

export class AsyncPredictResponse<DocType extends Document> extends BasePredictResponse<DocType> {
  job: Job;
  document?: Response<DocType>;

  constructor(serverResponse: StringDict, document?: Response<DocType>) {
    super(serverResponse);
    this.job = new Job(serverResponse["job"]);
    this.document = document;
  }
}
