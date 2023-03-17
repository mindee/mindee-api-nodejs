export interface Job {
  issuedAt: Date;
  availableAt?: any;
  id?: any;
  status?: any;
}

export class PredictEnqueueResponse {
  job: Job;

  constructor(job: Job) {
    this.job = job;
  }
}
