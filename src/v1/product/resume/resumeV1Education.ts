
import { cleanAndTruncate } from "@/v1/parsing/common/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * The list of the candidate's educational background.
 */
export class ResumeV1Education {
  /** The area of study or specialization. */
  degreeDomain: string | null;
  /** The type of degree obtained, such as Bachelor's, Master's, or Doctorate. */
  degreeType: string | null;
  /** The month when the education program or course was completed. */
  endMonth: string | null;
  /** The year when the education program or course was completed. */
  endYear: string | null;
  /** The name of the school. */
  school: string | null;
  /** The month when the education program or course began. */
  startMonth: string | null;
  /** The year when the education program or course began. */
  startYear: string | null;
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
    this.degreeDomain = prediction["degree_domain"];
    this.degreeType = prediction["degree_type"];
    this.endMonth = prediction["end_month"];
    this.endYear = prediction["end_year"];
    this.school = prediction["school"];
    this.startMonth = prediction["start_month"];
    this.startYear = prediction["start_year"];
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
      degreeDomain: cleanAndTruncate(this.degreeDomain, 15),
      degreeType: cleanAndTruncate(this.degreeType, 25),
      endMonth: cleanAndTruncate(this.endMonth, 9),
      endYear: cleanAndTruncate(this.endYear, 8),
      school: cleanAndTruncate(this.school, 25),
      startMonth: cleanAndTruncate(this.startMonth, 11),
      startYear: cleanAndTruncate(this.startYear, 10),
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Domain: " +
      printable.degreeDomain +
      ", Degree: " +
      printable.degreeType +
      ", End Month: " +
      printable.endMonth +
      ", End Year: " +
      printable.endYear +
      ", School: " +
      printable.school +
      ", Start Month: " +
      printable.startMonth +
      ", Start Year: " +
      printable.startYear
    );
  }

  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.degreeDomain.padEnd(15) +
      " | " +
      printable.degreeType.padEnd(25) +
      " | " +
      printable.endMonth.padEnd(9) +
      " | " +
      printable.endYear.padEnd(8) +
      " | " +
      printable.school.padEnd(25) +
      " | " +
      printable.startMonth.padEnd(11) +
      " | " +
      printable.startYear.padEnd(10) +
      " |"
    );
  }
}
