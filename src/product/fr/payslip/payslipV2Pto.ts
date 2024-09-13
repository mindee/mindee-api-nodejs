import { floatToString } from "../../../parsing/standard";
import { cleanSpaces } from "../../../parsing/common/summaryHelper";
import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Information about paid time off.
 */
export class PayslipV2Pto {
  /** The amount of paid time off accrued in this period. */
  accruedThisPeriod: number | undefined;
  /** The balance of paid time off at the end of the period. */
  balanceEndOfPeriod: number | undefined;
  /** The amount of paid time off used in this period. */
  usedThisPeriod: number | undefined;
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
    if (prediction["accrued_this_period"] && !isNaN(prediction["accrued_this_period"])) {
      this.accruedThisPeriod = +parseFloat(prediction["accrued_this_period"]).toFixed(3);
    }
    if (prediction["balance_end_of_period"] && !isNaN(prediction["balance_end_of_period"])) {
      this.balanceEndOfPeriod = +parseFloat(prediction["balance_end_of_period"]).toFixed(3);
    }
    if (prediction["used_this_period"] && !isNaN(prediction["used_this_period"])) {
      this.usedThisPeriod = +parseFloat(prediction["used_this_period"]).toFixed(3);
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
