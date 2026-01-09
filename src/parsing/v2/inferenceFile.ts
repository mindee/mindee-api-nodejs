import { StringDict } from "@/parsing/common/stringDict.js";

export class InferenceFile {
  /**
   * Name of the file.
   */
  public name: string;
  /**
   * Optional alias for the file.
   */
  public alias: string;
  /**
   * Page count.
   */
  public pageCount: number;
  /**
   * MIME type.
   */
  public mimeType: string;

  constructor(serverResponse: StringDict) {
    this.name = serverResponse["name"];
    this.alias = serverResponse["alias"];
    this.pageCount = serverResponse["page_count"];
    this.mimeType = serverResponse["mime_type"];
  }

  toString () {
    return(
      "File\n" +
      "====\n" +
      `:Name: ${this.name}\n` +
      `:Alias:${this.alias ? " " + this.alias : ""}\n`) +
      `:Page Count: ${this.pageCount}\n` +
      `:MIME Type: ${this.mimeType}\n`;
  }
}
