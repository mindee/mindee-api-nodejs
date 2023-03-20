import { StringDict } from "../fields";

export class Job {
  issuedAt: Date;
  availableAt?: Date;
  id?: string;
  status?: string;

  constructor(jsonResponse: StringDict) {
    this.issuedAt = new Date(jsonResponse["issued_at"]);
    if (
      jsonResponse["available_at"] !== undefined &&
      jsonResponse["available_at"] !== null
    ) {
      this.availableAt = new Date(jsonResponse["available_at"]);
    }
    this.id = jsonResponse["id"];
    this.status = jsonResponse["status"];
  }
}

export class ApiRequest {
  error: StringDict;
  resources: string[];
  status: string;
  /** HTTP status code */
  statusCode: number;
  url: string;

  constructor(jsonResponse: StringDict) {
    this.error = jsonResponse["error"];
    this.resources = jsonResponse["resources"];
    this.status = jsonResponse["status"];
    this.statusCode = jsonResponse["status_code"];
    this.url = jsonResponse["url"];
  }
}

export class PredictEnqueueResponse {
  job: Job;
  apiRequest: ApiRequest;

  constructor(apiRequest: StringDict, job: StringDict) {
    this.apiRequest = new ApiRequest(apiRequest);
    this.job = new Job(job);
  }
}
