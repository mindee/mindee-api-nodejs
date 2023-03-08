import { ApiRequest, Job } from "./common";

export class PredictEnqueueResponse {
  job: Job;

  constructor(apiRequest: ApiRequest, job: Job) {
    this.apiRequest = apiRequest;
    this.job = job;
  }
}
