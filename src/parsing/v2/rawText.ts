import { StringDict } from "../common";
import { RawTextPage } from "./rawTextPage";

export class RawText {
  pages: Array<RawTextPage>;

  constructor(serverResponse: StringDict) {
    this.pages = serverResponse["pages"] ? serverResponse["pages"].map(
      (rawTextPage: StringDict) => new RawTextPage(rawTextPage)
    ) : [];
  }
}
