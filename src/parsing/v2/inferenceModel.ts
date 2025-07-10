import { StringDict } from "../common";

export class InferenceModel {
  /**
   * ID of the model.
   */
  public id: string;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
  }
}
