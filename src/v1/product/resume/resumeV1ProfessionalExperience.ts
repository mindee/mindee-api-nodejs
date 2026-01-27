
import { cleanSpecialChars } from "@/v1/parsing/common/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * The list of the candidate's professional experiences.
 */
export class ResumeV1ProfessionalExperience {
  /** The type of contract for the professional experience. */
  contractType: string | null;
  /** The specific department or division within the company. */
  department: string | null;
  /** The description of the professional experience as written in the document. */
  description: string | null;
  /** The name of the company or organization. */
  employer: string | null;
  /** The month when the professional experience ended. */
  endMonth: string | null;
  /** The year when the professional experience ended. */
  endYear: string | null;
  /** The position or job title held by the candidate. */
  role: string | null;
  /** The month when the professional experience began. */
  startMonth: string | null;
  /** The year when the professional experience began. */
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
    this.contractType = prediction["contract_type"];
    this.department = prediction["department"];
    this.description = prediction["description"];
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
          cleanSpecialChars(this.contractType) :
          cleanSpecialChars(this.contractType).slice(0, 12) + "..." :
        "",
      department: this.department ?
        this.department.length <= 10 ?
          cleanSpecialChars(this.department) :
          cleanSpecialChars(this.department).slice(0, 7) + "..." :
        "",
      description: this.description ?
        this.description.length <= 36 ?
          cleanSpecialChars(this.description) :
          cleanSpecialChars(this.description).slice(0, 33) + "..." :
        "",
      employer: this.employer ?
        this.employer.length <= 25 ?
          cleanSpecialChars(this.employer) :
          cleanSpecialChars(this.employer).slice(0, 22) + "..." :
        "",
      endMonth: this.endMonth ?
        this.endMonth.length <= 9 ?
          cleanSpecialChars(this.endMonth) :
          cleanSpecialChars(this.endMonth).slice(0, 6) + "..." :
        "",
      endYear: this.endYear ?
        this.endYear.length <= 8 ?
          cleanSpecialChars(this.endYear) :
          cleanSpecialChars(this.endYear).slice(0, 5) + "..." :
        "",
      role: this.role ?
        this.role.length <= 20 ?
          cleanSpecialChars(this.role) :
          cleanSpecialChars(this.role).slice(0, 17) + "..." :
        "",
      startMonth: this.startMonth ?
        this.startMonth.length <= 11 ?
          cleanSpecialChars(this.startMonth) :
          cleanSpecialChars(this.startMonth).slice(0, 8) + "..." :
        "",
      startYear: this.startYear ?
        this.startYear.length <= 10 ?
          cleanSpecialChars(this.startYear) :
          cleanSpecialChars(this.startYear).slice(0, 7) + "..." :
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
      ", Description: " +
      printable.description +
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
      printable.description.padEnd(36) +
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
