import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Information about the employment.
 */
export class PayslipV3Employment {
  /** The category of the employment. */
  category: string | null;
  /** The coefficient of the employment. */
  coefficient: string | null;
  /** The collective agreement of the employment. */
  collectiveAgreement: string | null;
  /** The job title of the employee. */
  jobTitle: string | null;
  /** The position level of the employment. */
  positionLevel: string | null;
  /** The seniority date of the employment. */
  seniorityDate: string | null;
  /** The start date of the employment. */
  startDate: string | null;
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
    this.category = prediction["category"];
    this.coefficient = prediction["coefficient"];
    this.collectiveAgreement = prediction["collective_agreement"];
    this.jobTitle = prediction["job_title"];
    this.positionLevel = prediction["position_level"];
    this.seniorityDate = prediction["seniority_date"];
    this.startDate = prediction["start_date"];
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
      category: this.category ?? "",
      coefficient: this.coefficient ?? "",
      collectiveAgreement: this.collectiveAgreement ?? "",
      jobTitle: this.jobTitle ?? "",
      positionLevel: this.positionLevel ?? "",
      seniorityDate: this.seniorityDate ?? "",
      startDate: this.startDate ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Category: " +
      printable.category +
      ", Coefficient: " +
      printable.coefficient +
      ", Collective Agreement: " +
      printable.collectiveAgreement +
      ", Job Title: " +
      printable.jobTitle +
      ", Position Level: " +
      printable.positionLevel +
      ", Seniority Date: " +
      printable.seniorityDate +
      ", Start Date: " +
      printable.startDate
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Category: ${printable.category}
  :Coefficient: ${printable.coefficient}
  :Collective Agreement: ${printable.collectiveAgreement}
  :Job Title: ${printable.jobTitle}
  :Position Level: ${printable.positionLevel}
  :Seniority Date: ${printable.seniorityDate}
  :Start Date: ${printable.startDate}`.trimEnd();
  }
}
