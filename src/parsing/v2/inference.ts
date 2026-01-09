import { StringDict } from "@/parsing/common/stringDict.js";
import { InferenceModel } from "./inferenceModel.js";
import { InferenceResult } from "./inferenceResult.js";
import { InferenceFile } from "./inferenceFile.js";
import { InferenceActiveOptions } from "./inferenceActiveOptions.js";

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
