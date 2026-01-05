import { StringDict } from "@/parsing/common/stringDict.js";

export class InferenceModel {
  /**
   * ID of the model.
   */
  public id: string;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
  }

  toString(): string {
    return "Model\n" +
      "=====\n" +
      `:ID: ${this.id}\n`;
  }
}
