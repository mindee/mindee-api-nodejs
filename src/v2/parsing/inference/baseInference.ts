import { StringDict } from "@/parsing/index.js";
import { InferenceModel } from "./inferenceModel.js";
import { InferenceFile } from "./inferenceFile.js";
import { InferenceJob } from "./inferenceJob.js";

export abstract class BaseInference {
  /**
   * Model info for the inference.
   */
  public model: InferenceModel;
  /**
   * Job the inference belongs to.
   */
  public job: InferenceJob;
  /**
   * File info for the inference.
   */
  public file: InferenceFile;
  /**
   * ID of the inference.
   */
  public id: string;

  protected constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    this.job = new InferenceJob(serverResponse["job"]);
    this.model = new InferenceModel(serverResponse["model"]);
    this.file = new InferenceFile(serverResponse["file"]);
  }

  toString(): string {
    return (
      "Inference\n" +
      "#########\n" +
      this.model.toString() + "\n" +
      this.file.toString() + "\n"
    );
  }
}
