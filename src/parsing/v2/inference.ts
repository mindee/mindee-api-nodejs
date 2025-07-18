import { StringDict } from "../common";
import { InferenceResultModel } from "./inferenceResultModel";
import { InferenceResult } from "./inferenceResult";
import { InferenceResultFile } from "./inferenceResultFile";

export class Inference {
  /**
   * Model info for the inference.
   */
  public model: InferenceResultModel;
  /**
   * File info for the inference.
   */
  public file: InferenceResultFile;
  /**
   * Result of the inference.
   */
  public result: InferenceResult;
  /**
   * ID of the inference.
   */
  public id?: string;

  constructor(serverResponse: StringDict) {
    this.model = new InferenceResultModel(serverResponse["model"]);
    this.file = new InferenceResultFile(serverResponse["file"]);
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
