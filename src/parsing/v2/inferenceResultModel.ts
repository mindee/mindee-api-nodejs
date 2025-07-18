import { StringDict } from "../common";

export class InferenceResultModel {
  /**
   * ID of the model.
   */
  public id: string;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
  }
}
