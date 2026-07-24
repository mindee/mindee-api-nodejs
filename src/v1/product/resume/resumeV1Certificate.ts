import { cleanAndTruncate } from "@/v1/parsing/common/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * The list of certificates obtained by the candidate.
 */
export class ResumeV1Certificate {
  /** The grade obtained for the certificate. */
  grade: string | null;
  /** The name of certification. */
  name: string | null;
  /** The organization or institution that issued the certificate. */
  provider: string | null;
  /** The year when a certificate was issued or received. */
  year: string | null;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = new Polygon();

  constructor({ prediction = {} }: StringDict) {
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
      grade: cleanAndTruncate(this.grade, 10),
      name: cleanAndTruncate(this.name, 30),
      provider: cleanAndTruncate(this.provider, 25),
      year: cleanAndTruncate(this.year, 4),
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
