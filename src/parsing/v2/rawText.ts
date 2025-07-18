import { StringDict } from "../common";


export class RawText {
  /**
   * The page number the text was found on.
   */
  public page: number;
  /**
   * The text content found on the page.
   */
  public content: string;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    this.page = serverResponse["page"];
    this.content = serverResponse["content"];
  }
}
