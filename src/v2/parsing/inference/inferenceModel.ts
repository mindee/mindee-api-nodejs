import { StringDict } from "@/parsing/stringDict.js";

/** Model metadata attached to a v2 inference. */
export class InferenceModel {
  /**
   * ID of the model.
   */
  public id: string;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
  }

  /** Returns a printable representation of model metadata. */
  toString(): string {
    return "Model\n" +
      "=====\n" +
      `:ID: ${this.id}\n`;
  }
}
