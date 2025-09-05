import { StringDict } from "../common";
import { InferenceModel } from "./inferenceModel";
import { InferenceResult } from "./inferenceResult";
import { InferenceFile } from "./inferenceFile";
import { InferenceActiveOptions } from "./inferenceActiveOptions";

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
  /**
   * Active options for the inference.
   */
  public activeOptions: InferenceActiveOptions;

  constructor(serverResponse: StringDict) {
    this.model = new InferenceModel(serverResponse["model"]);
    this.file = new InferenceFile(serverResponse["file"]);
    this.result = new InferenceResult(serverResponse["result"]);
    this.activeOptions = new InferenceActiveOptions(serverResponse["active_options"]);
  }

  toString(): string {
    return (
      "Inference\n" +
      "#########\n" +
      this.model.toString() + "\n" +
      this.file.toString() + "\n" +
      this.activeOptions.toString() + "\n" +
      this.result + "\n"
    );
  }
}
