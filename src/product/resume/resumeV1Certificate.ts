import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The list of certificates obtained by the candidate.
 */
export class ResumeV1Certificate {
  /** The grade obtained for the certificate. */
  grade: string | undefined;
  /** The name of certifications obtained by the individual. */
  name: string | undefined;
  /** The organization or institution that issued the certificates listed in the document. */
  provider: string | undefined;
  /** The year when a certificate was issued or received. */
  year: string | undefined;
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
    this.grade = prediction["grade"];
    this.name = prediction["name"];
    this.provider = prediction["provider"];
    this.year = prediction["year"];
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
      grade: this.grade ?
        this.grade.length <= 10 ?
          this.grade :
          this.grade.slice(0, 7) + "..." :
        "",
      name: this.name ?
        this.name.length <= 30 ?
          this.name :
          this.name.slice(0, 27) + "..." :
        "",
      provider: this.provider ?
        this.provider.length <= 25 ?
          this.provider :
          this.provider.slice(0, 22) + "..." :
        "",
      year: this.year ?
        this.year.length <= 4 ?
          this.year :
          this.year.slice(0, 1) + "..." :
        "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Grade: " +
      printable.grade +
      ", Name: " +
      printable.name +
      ", Provider: " +
      printable.provider +
      ", Year: " +
      printable.year
    );
  }
  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.grade.padEnd(10) +
      " | " +
      printable.name.padEnd(30) +
      " | " +
      printable.provider.padEnd(25) +
      " | " +
      printable.year.padEnd(4) +
      " |"
    );
  }
}
