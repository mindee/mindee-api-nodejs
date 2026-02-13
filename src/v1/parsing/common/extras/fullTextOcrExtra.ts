import { StringDict } from "@/parsing/stringDict.js";
import { ExtraField } from "./extras.js";

export class FullTextOcrExtra extends ExtraField {
  content?: string;
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
