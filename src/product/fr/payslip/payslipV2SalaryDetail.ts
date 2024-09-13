import { floatToString } from "../../../parsing/standard";
import { cleanSpaces } from "../../../parsing/common/summaryHelper";
import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Detailed information about the earnings.
 */
export class PayslipV2SalaryDetail {
  /** The amount of the earnings. */
  amount: number | undefined;
  /** The base value of the earnings. */
  base: number | undefined;
  /** The description of the earnings. */
  description: string | undefined;
  /** The rate of the earnings. */
  rate: number | undefined;
  /** Confidence score */
  confidence: number = 0.0;
  /** The document page on which the information was found. */
  pageId: number;
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon = [];

  constructor({ prediction = {} }: StringDict) {
    if (prediction["amount"] && !isNaN(prediction["amount"])) {
      this.amount = +parseFloat(prediction["amount"]).toFixed(3);
    }
    if (prediction["base"] && !isNaN(prediction["base"])) {
      this.base = +parseFloat(prediction["base"]).toFixed(3);
    }
    this.description = prediction["description"];
    if (prediction["rate"] && !isNaN(prediction["rate"])) {
      this.rate = +parseFloat(prediction["rate"]).toFixed(3);
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
      amount: this.amount !== undefined ? floatToString(this.amount) : "",
      base: this.base !== undefined ? floatToString(this.base) : "",
      description: this.description ?
        this.description.length <= 36 ?
          cleanSpaces(this.description) :
          cleanSpaces(this.description).slice(0, 33) + "..." :
        "",
      rate: this.rate !== undefined ? floatToString(this.rate) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Amount: " +
      printable.amount +
      ", Base: " +
      printable.base +
      ", Description: " +
      printable.description +
      ", Rate: " +
      printable.rate
    );
  }
  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.amount.padEnd(12) +
      " | " +
      printable.base.padEnd(8) +
      " | " +
      printable.description.padEnd(36) +
      " | " +
      printable.rate.padEnd(8) +
      " |"
    );
  }
}
