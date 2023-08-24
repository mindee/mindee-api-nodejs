import { Word } from "../standard";
import { StringDict } from "./stringDict";
import { OcrPage } from "./ocrPage";

export class MvisionV1 {
  /** List of words found on the page. */
  pages: OcrPage[] = [];

  constructor(rawPrediction: StringDict) {
    rawPrediction["pages"].map((page: Word) => {
      this.pages.push(new OcrPage(page));
    });
  }
  /**
   * Default string representation.
   */
  toString(): string {
    return this.pages.map((page: OcrPage) => page.toString()).join("\n") + "\n";
  }
}
