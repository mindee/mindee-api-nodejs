import { StringDict } from "@/parsing/stringDict.js";
import { RawTextPage } from "./rawTextPage.js";

export class RawText {
  /**
   * List of pages with their extracted text content.
   */
  pages: Array<RawTextPage>;

  constructor(serverResponse: StringDict) {
    this.pages = serverResponse["pages"] ? serverResponse["pages"].map(
      (rawTextPage: StringDict) => new RawTextPage(rawTextPage)
    ) : [];
  }

  toString(): string {
    return this.pages.map(page => page.toString()).join("\n\n");
  }
}
