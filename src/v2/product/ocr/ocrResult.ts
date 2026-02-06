import { StringDict } from "@/parsing/index.js";
import { OcrPage } from "./ocrPage.js";

/**
 * OCR result info.
 */
export class OcrResult {
  /**
   * List of OCR results for each page in the document.
   */
  pages: OcrPage[];

  constructor(serverResponse: StringDict) {
    this.pages = serverResponse.pages.map((ocr: any) => new OcrPage(ocr));
  }

  toString(): string {
    let pages = "\n";
    if (this.pages.length > 0) {
      pages += this.pages.map(ocr => ocr.toString()).join("\n\n");
    }
    return `Pages\n======${pages}`;
  }
}
