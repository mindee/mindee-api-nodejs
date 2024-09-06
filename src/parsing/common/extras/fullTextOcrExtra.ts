import { StringDict } from "../stringDict";
import { ExtraField } from "./extras";

export class FullTextOcrExtra extends ExtraField {
  content?: string;
  languages?: string;

  constructor(rawPrediction: StringDict) {
    super();
    if (rawPrediction["full_text_ocr"] !== undefined && rawPrediction["full_text_ocr"]["content"]) {
      this.content = "content" in rawPrediction["full_text_ocr"] ? rawPrediction["full_text_ocr"]["content"] : "";
      this.languages = "languages" in rawPrediction["full_text_ocr"] ? rawPrediction["full_text_ocr"]["languages"] : "";
    }
  }

  /**
   * Default string representation.
   */
  toString() {
    return this.content !== undefined ? this.content : "";
  }
}
