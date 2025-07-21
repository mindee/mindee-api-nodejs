import { StringDict } from "../common";

export class InferenceResultFile {
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

  toString () {
    return(
      "File\n" +
      "====\n" +
      `:Name: ${this.name}\n` +
      `:Alias:${this.alias ? " " + this.alias : ""}\n`);
  }
}
