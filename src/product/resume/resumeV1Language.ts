import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The list of languages that a person is proficient in, as stated in their resume.
 */
export class ResumeV1Language {
  /** The language ISO 639 code. */
  language: string | undefined;
  /** The level for the language. Possible values: 'Fluent', 'Proficient', 'Intermediate' and 'Beginner'. */
  level: string | undefined;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = [];

  constructor({prediction = {} }: StringDict) {
    this.language = prediction["language"];
    this.level = prediction["level"];
    this.pageId = prediction["page_id"];
    this.confidence = prediction["confidence"] ? prediction.confidence : 0.0;
    if (prediction["polygon"]) {
      this.polygon = prediction.polygon;
    }
  }

  /**
   * Collection of fields as representable strings.
   */
  #printableValues() {
    return {
      language: this.language ?
        this.language.length <= 8 ?
          this.language :
          this.language.slice(0, 5) + "..." :
        "",
      level: this.level ?
        this.level.length <= 20 ?
          this.level :
          this.level.slice(0, 17) + "..." :
        "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Language: " +
      printable.language +
      ", Level: " +
      printable.level
    );
  }
  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.language.padEnd(8) +
      " | " +
      printable.level.padEnd(20) +
      " |"
    );
  }
}
