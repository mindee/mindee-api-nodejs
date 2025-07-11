import { InferenceFields } from "./inferenceFields";
import { InferenceOptions } from "./inferenceOptions";
import { StringDict } from "../common";

export class InferenceResult {
  /**
   * Fields contained in the inference.
   */
  public fields: InferenceFields;

  /**
   * Potential options retrieved alongside the inference.
   */
  public options?: InferenceOptions;

  constructor(serverResponse: StringDict) {
    this.fields = new InferenceFields(serverResponse["fields"]);
    if (serverResponse["options"]) {
      this.options = new InferenceOptions(serverResponse["options"]);
    }
  }

  toString(): string {
    let outStr: string = `:fields:\n${this.fields}`;
    if (this.options) {
      outStr += `\n:options: ${this.options}`;
    }
    return outStr;
  }
}
