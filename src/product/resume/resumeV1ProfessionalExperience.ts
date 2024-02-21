import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The list of the candidate's professional experiences.
 */
export class ResumeV1ProfessionalExperience {
  /** The type of contract for the professional experience. */
  contractType: string | undefined;
  /** The specific department or division within the company. */
  department: string | undefined;
  /** The name of the company or organization. */
  employer: string | undefined;
  /** The month when the professional experience ended. */
  endMonth: string | undefined;
  /** The year when the professional experience ended. */
  endYear: string | undefined;
  /** The position or job title held by the candidate. */
  role: string | undefined;
  /** The month when the professional experience began. */
  startMonth: string | undefined;
  /** The year when the professional experience began. */
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
    this.contractType = prediction["contract_type"];
    this.department = prediction["department"];
    this.employer = prediction["employer"];
    this.endMonth = prediction["end_month"];
    this.endYear = prediction["end_year"];
    this.role = prediction["role"];
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
      contractType: this.contractType ?
        this.contractType.length <= 15 ?
          this.contractType :
          this.contractType.slice(0, 12) + "..." :
        "",
      department: this.department ?
        this.department.length <= 10 ?
          this.department :
          this.department.slice(0, 7) + "..." :
        "",
      employer: this.employer ?
        this.employer.length <= 25 ?
          this.employer :
          this.employer.slice(0, 22) + "..." :
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
      role: this.role ?
        this.role.length <= 20 ?
          this.role :
          this.role.slice(0, 17) + "..." :
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
      "Contract Type: " +
      printable.contractType +
      ", Department: " +
      printable.department +
      ", Employer: " +
      printable.employer +
      ", End Month: " +
      printable.endMonth +
      ", End Year: " +
      printable.endYear +
      ", Role: " +
      printable.role +
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
      printable.contractType.padEnd(15) +
      " | " +
      printable.department.padEnd(10) +
      " | " +
      printable.employer.padEnd(25) +
      " | " +
      printable.endMonth.padEnd(9) +
      " | " +
      printable.endYear.padEnd(8) +
      " | " +
      printable.role.padEnd(20) +
      " | " +
      printable.startMonth.padEnd(11) +
      " | " +
      printable.startYear.padEnd(10) +
      " |"
    );
  }
}
