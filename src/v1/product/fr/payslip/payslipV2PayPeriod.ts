import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * Information about the pay period.
 */
export class PayslipV2PayPeriod {
  /** The end date of the pay period. */
  endDate: string | null;
  /** The month of the pay period. */
  month: string | null;
  /** The date of payment for the pay period. */
  paymentDate: string | null;
  /** The start date of the pay period. */
  startDate: string | null;
  /** The year of the pay period. */
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
    this.endDate = prediction["end_date"];
    this.month = prediction["month"];
    this.paymentDate = prediction["payment_date"];
    this.startDate = prediction["start_date"];
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
      endDate: this.endDate ?? "",
      month: this.month ?? "",
      paymentDate: this.paymentDate ?? "",
      startDate: this.startDate ?? "",
      year: this.year ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "End Date: " +
      printable.endDate +
      ", Month: " +
      printable.month +
      ", Payment Date: " +
      printable.paymentDate +
      ", Start Date: " +
      printable.startDate +
      ", Year: " +
      printable.year
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :End Date: ${printable.endDate}
  :Month: ${printable.month}
  :Payment Date: ${printable.paymentDate}
  :Start Date: ${printable.startDate}
  :Year: ${printable.year}`.trimEnd();
  }
}
