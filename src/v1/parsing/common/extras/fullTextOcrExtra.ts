import { StringDict } from "@/parsing/stringDict.js";
import { ExtraField } from "./extras.js";

/** Full-text OCR extra payload returned by compatible APIs. */
export class FullTextOcrExtra extends ExtraField {
  /** Concatenated OCR content. */
  content?: string;
  /** OCR language hints associated with the content. */
  languages?: string;

  constructor(rawPrediction: StringDict) {
    super();
    if (rawPrediction["content"]) {
      this.content = "content" in rawPrediction ? rawPrediction["content"] : "";
      this.languages = "languages" in rawPrediction ? rawPrediction["languages"] : "";
    }
  }

  /**
   * Default string representation.
   */
  toString() {
    return this.content !== undefined ? this.content : "";
  }
}
