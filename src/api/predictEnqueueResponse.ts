import { Job } from "./common";

export class PredictEnqueueResponse {
  job: Job;

  constructor(job: Job) {
    this.job = job;
  }
}
