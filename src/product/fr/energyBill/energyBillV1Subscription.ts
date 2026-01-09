import { cleanSpecialChars, floatToString } from "@/parsing/common/index.js";
import { StringDict } from "@/parsing/common/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * The subscription details fee for the energy service.
 */
export class EnergyBillV1Subscription {
  /** Description or details of the subscription. */
  description: string | null;
  /** The end date of the subscription. */
  endDate: string | null;
  /** The start date of the subscription. */
  startDate: string | null;
  /** The rate of tax applied to the total cost. */
  taxRate: number | null;
  /** The total cost of subscription. */
  total: number | null;
  /** The price per unit of subscription. */
  unitPrice: number | null;
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
    this.description = prediction["description"];
    this.endDate = prediction["end_date"];
    this.startDate = prediction["start_date"];
    if (
      prediction["tax_rate"] !== undefined &&
      prediction["tax_rate"] !== null &&
      !isNaN(prediction["tax_rate"])
    ) {
      this.taxRate = +parseFloat(prediction["tax_rate"]);
    } else {
      this.taxRate = null;
    }
    if (
      prediction["total"] !== undefined &&
      prediction["total"] !== null &&
      !isNaN(prediction["total"])
    ) {
      this.total = +parseFloat(prediction["total"]);
    } else {
      this.total = null;
    }
    if (
      prediction["unit_price"] !== undefined &&
      prediction["unit_price"] !== null &&
      !isNaN(prediction["unit_price"])
    ) {
      this.unitPrice = +parseFloat(prediction["unit_price"]);
    } else {
      this.unitPrice = null;
    }
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
      description: this.description ?
        this.description.length <= 36 ?
          cleanSpecialChars(this.description) :
          cleanSpecialChars(this.description).slice(0, 33) + "..." :
        "",
      endDate: this.endDate ?
        this.endDate.length <= 10 ?
          cleanSpecialChars(this.endDate) :
          cleanSpecialChars(this.endDate).slice(0, 7) + "..." :
        "",
      startDate: this.startDate ?
        this.startDate.length <= 10 ?
          cleanSpecialChars(this.startDate) :
          cleanSpecialChars(this.startDate).slice(0, 7) + "..." :
        "",
      taxRate: this.taxRate !== undefined ? floatToString(this.taxRate) : "",
      total: this.total !== undefined ? floatToString(this.total) : "",
      unitPrice: this.unitPrice !== undefined ? floatToString(this.unitPrice) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Description: " +
      printable.description +
      ", End Date: " +
      printable.endDate +
      ", Start Date: " +
      printable.startDate +
      ", Tax Rate: " +
      printable.taxRate +
      ", Total: " +
      printable.total +
      ", Unit Price: " +
      printable.unitPrice
    );
  }

  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.description.padEnd(36) +
      " | " +
      printable.endDate.padEnd(10) +
      " | " +
      printable.startDate.padEnd(10) +
      " | " +
      printable.taxRate.padEnd(8) +
      " | " +
      printable.total.padEnd(9) +
      " | " +
      printable.unitPrice.padEnd(10) +
      " |"
    );
  }
}
