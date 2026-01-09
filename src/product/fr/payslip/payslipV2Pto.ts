import { floatToString } from "@/parsing/common/index.js";
import { StringDict } from "@/parsing/common/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * Information about paid time off.
 */
export class PayslipV2Pto {
  /** The amount of paid time off accrued in this period. */
  accruedThisPeriod: number | null;
  /** The balance of paid time off at the end of the period. */
  balanceEndOfPeriod: number | null;
  /** The amount of paid time off used in this period. */
  usedThisPeriod: number | null;
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
    if (
      prediction["accrued_this_period"] !== undefined &&
      prediction["accrued_this_period"] !== null &&
      !isNaN(prediction["accrued_this_period"])
    ) {
      this.accruedThisPeriod = +parseFloat(prediction["accrued_this_period"]);
    } else {
      this.accruedThisPeriod = null;
    }
    if (
      prediction["balance_end_of_period"] !== undefined &&
      prediction["balance_end_of_period"] !== null &&
      !isNaN(prediction["balance_end_of_period"])
    ) {
      this.balanceEndOfPeriod = +parseFloat(prediction["balance_end_of_period"]);
    } else {
      this.balanceEndOfPeriod = null;
    }
    if (
      prediction["used_this_period"] !== undefined &&
      prediction["used_this_period"] !== null &&
      !isNaN(prediction["used_this_period"])
    ) {
      this.usedThisPeriod = +parseFloat(prediction["used_this_period"]);
    } else {
      this.usedThisPeriod = null;
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
      accruedThisPeriod:
        this.accruedThisPeriod !== undefined ? floatToString(this.accruedThisPeriod) : "",
      balanceEndOfPeriod:
        this.balanceEndOfPeriod !== undefined ? floatToString(this.balanceEndOfPeriod) : "",
      usedThisPeriod:
        this.usedThisPeriod !== undefined ? floatToString(this.usedThisPeriod) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Accrued This Period: " +
      printable.accruedThisPeriod +
      ", Balance End of Period: " +
      printable.balanceEndOfPeriod +
      ", Used This Period: " +
      printable.usedThisPeriod
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Accrued This Period: ${printable.accruedThisPeriod}
  :Balance End of Period: ${printable.balanceEndOfPeriod}
  :Used This Period: ${printable.usedThisPeriod}`.trimEnd();
  }
}
