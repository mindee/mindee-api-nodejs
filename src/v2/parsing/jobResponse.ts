import { BaseResponse } from "./baseResponse.js";
import { StringDict } from "@/parsing/stringDict.js";
import { Job } from "./job.js";

export class JobResponse extends BaseResponse {
  /**
   * Job for the polling.
   */
  public job: Job;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.job = new Job(serverResponse["job"]);
  }
}
