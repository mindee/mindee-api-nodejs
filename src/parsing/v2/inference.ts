import { StringDict } from "../common";
import { InferenceModel } from "./inferenceModel";
import { InferenceResult } from "./inferenceResult";
import { InferenceFile } from "./inferenceFile";

export class Inference {
  /**
   * Model info for the inference.
   */
  public model: InferenceModel;
  /**
   * File info for the inference.
   */
  public file: InferenceFile;
  /**
   * Result of the inference.
   */
  public result: InferenceResult;
  /**
   * ID of the inference.
   */
  public id?: string;

  constructor(serverResponse: StringDict) {
    this.model = new InferenceModel(serverResponse["model"]);
    this.file = new InferenceFile(serverResponse["file"]);
    this.result = new InferenceResult(serverResponse["result"]);
    if ("id" in serverResponse) {
      this.id = serverResponse["id"];
    }
  }

  toString(): string {
    return (
      "Inference\n" +
      "#########\n" +
      "Model\n" +
      "=====\n" +
      `:ID: ${this.model.id}\n\n` +
      this.file.toString() + "\n" +
      this.result + "\n"
    );
  }
}
