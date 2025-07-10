import { StringDict } from "../common";

export class InferenceFile {
  /**
   * Name of the file.
   */
  public name: string;
  /**
   * Optional alias for the file.
   */
  public alias: string;

  constructor(serverResponse: StringDict) {
    this.name = serverResponse["name"];
    this.alias = serverResponse["alias"];
  }
}
