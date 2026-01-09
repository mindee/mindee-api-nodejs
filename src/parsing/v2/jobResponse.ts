import { CommonResponse } from "./commonResponse.js";
import { StringDict } from "@/parsing/common/stringDict.js";
import { Job } from "./job.js";

export class JobResponse extends CommonResponse {
  /**
   * Job for the polling.
   */
  public job: Job;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.job = new Job(serverResponse["job"]);
  }
}
