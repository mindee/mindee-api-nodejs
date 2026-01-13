import { Word } from "@/v1/parsing/standard/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { OcrPage } from "./ocrPage.js";

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
