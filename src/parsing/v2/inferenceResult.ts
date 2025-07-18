import { InferenceFields } from "./field/inferenceFields";
import { InferenceResultOptions } from "./inferenceResultOptions";
import { StringDict } from "../common";

export class InferenceResult {
  /**
   * Fields contained in the inference.
   */
  public fields: InferenceFields;

  /**
   * Potential options retrieved alongside the inference.
   */
  public options?: InferenceResultOptions;

  constructor(serverResponse: StringDict) {
    this.fields = new InferenceFields(serverResponse["fields"]);
    if (serverResponse["options"]) {
      this.options = new InferenceResultOptions(serverResponse["options"]);
    }
  }

  toString(): string {
    const parts: string[] = [
      "Fields",
      "======",
      this.fields.toString(),
    ];

    if (this.options) {
      parts.push(
        "Options",
        "=======",
        this.options.toString()
      );
    }

    return parts.join("\n");
  }
}
