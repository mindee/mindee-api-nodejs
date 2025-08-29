import { StringDict } from "../common";

export class RawTextPage {
  /**
   * The text content found on the page.
   */
  public content: string;

  /**
   * @param serverResponse JSON response from the server.
   */
  constructor(serverResponse: StringDict) {
    this.content = serverResponse["content"];
  }
}
