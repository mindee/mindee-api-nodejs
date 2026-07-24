
import { cleanAndTruncate } from "@/v1/parsing/common/index.js";
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
      contractType: cleanAndTruncate(this.contractType, 15),
      department: cleanAndTruncate(this.department, 10),
      description: cleanAndTruncate(this.description, 36),
      employer: cleanAndTruncate(this.employer, 25),
      endMonth: cleanAndTruncate(this.endMonth, 9),
      endYear: cleanAndTruncate(this.endYear, 8),
      role: cleanAndTruncate(this.role, 20),
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
