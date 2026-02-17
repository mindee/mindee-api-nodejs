import { StringDict } from "@/parsing/stringDict.js";

export class InferenceJob {
  /**
   * UUID of the Job.
   */
  public id: string;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
  }

  toString () {
    return(
      "Job\n" +
      "===\n" +
      `:ID: ${this.id}\n`
    );
  }
}
