import { CommonResponse } from "./commonResponse";
import { StringDict } from "../common";
import { Job } from "./job";

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
