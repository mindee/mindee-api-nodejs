import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The list of values that represent the educational background of an individual.
 */
export class ResumeV1Education {
  /** The area of study or specialization pursued by an individual in their educational background. */
  degreeDomain: string | undefined;
  /** The type of degree obtained by the individual, such as Bachelor's, Master's, or Doctorate. */
  degreeType: string | undefined;
  /** The month when the education program or course was completed or is expected to be completed. */
  endMonth: string | undefined;
  /** The year when the education program or course was completed or is expected to be completed. */
  endYear: string | undefined;
  /** The name of the school the individual went to. */
  school: string | undefined;
  /** The month when the education program or course began. */
  startMonth: string | undefined;
  /** The year when the education program or course began. */
  startYear: string | undefined;
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
      degreeDomain: this.degreeDomain ?
        this.degreeDomain.length <= 15 ?
          this.degreeDomain :
          this.degreeDomain.slice(0, 12) + "..." :
        "",
      degreeType: this.degreeType ?
        this.degreeType.length <= 25 ?
          this.degreeType :
          this.degreeType.slice(0, 22) + "..." :
        "",
      endMonth: this.endMonth ?
        this.endMonth.length <= 9 ?
          this.endMonth :
          this.endMonth.slice(0, 6) + "..." :
        "",
      endYear: this.endYear ?
        this.endYear.length <= 8 ?
          this.endYear :
          this.endYear.slice(0, 5) + "..." :
        "",
      school: this.school ?
        this.school.length <= 25 ?
          this.school :
          this.school.slice(0, 22) + "..." :
        "",
      startMonth: this.startMonth ?
        this.startMonth.length <= 11 ?
          this.startMonth :
          this.startMonth.slice(0, 8) + "..." :
        "",
      startYear: this.startYear ?
        this.startYear.length <= 10 ?
          this.startYear :
          this.startYear.slice(0, 7) + "..." :
        "",
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
