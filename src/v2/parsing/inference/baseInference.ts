import { InferenceModel } from "@/v2/parsing/inference/inferenceModel.js";
import { InferenceFile } from "@/v2/index.js";
import { StringDict } from "@/parsing/index.js";

export abstract class BaseInference {
  /**
   * Model info for the inference.
   */
  public model: InferenceModel;
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
    this.model = new InferenceModel(serverResponse["model"]);
    this.file = new InferenceFile(serverResponse["file"]);
  }
}
