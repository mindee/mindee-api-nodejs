import { cleanSpecialChars, floatToString } from "@/v1/parsing/common/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * Information about paid time off.
 */
export class PayslipV3PaidTimeOff {
  /** The amount of paid time off accrued in the period. */
  accrued: number | null;
  /** The paid time off period. */
  period: string | null;
  /** The type of paid time off. */
  ptoType: string | null;
  /** The remaining amount of paid time off at the end of the period. */
  remaining: number | null;
  /** The amount of paid time off used in the period. */
  used: number | null;
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
      prediction["accrued"] !== undefined &&
      prediction["accrued"] !== null &&
      !isNaN(prediction["accrued"])
    ) {
      this.accrued = +parseFloat(prediction["accrued"]);
    } else {
      this.accrued = null;
    }
    this.period = prediction["period"];
    this.ptoType = prediction["pto_type"];
    if (
      prediction["remaining"] !== undefined &&
      prediction["remaining"] !== null &&
      !isNaN(prediction["remaining"])
    ) {
      this.remaining = +parseFloat(prediction["remaining"]);
    } else {
      this.remaining = null;
    }
    if (
      prediction["used"] !== undefined &&
      prediction["used"] !== null &&
      !isNaN(prediction["used"])
    ) {
      this.used = +parseFloat(prediction["used"]);
    } else {
      this.used = null;
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
      accrued: this.accrued !== undefined ? floatToString(this.accrued) : "",
      period: this.period ?
        this.period.length <= 6 ?
          cleanSpecialChars(this.period) :
          cleanSpecialChars(this.period).slice(0, 3) + "..." :
        "",
      ptoType: this.ptoType ?
        this.ptoType.length <= 11 ?
          cleanSpecialChars(this.ptoType) :
          cleanSpecialChars(this.ptoType).slice(0, 8) + "..." :
        "",
      remaining: this.remaining !== undefined ? floatToString(this.remaining) : "",
      used: this.used !== undefined ? floatToString(this.used) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Accrued: " +
      printable.accrued +
      ", Period: " +
      printable.period +
      ", Type: " +
      printable.ptoType +
      ", Remaining: " +
      printable.remaining +
      ", Used: " +
      printable.used
    );
  }

  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.accrued.padEnd(9) +
      " | " +
      printable.period.padEnd(6) +
      " | " +
      printable.ptoType.padEnd(11) +
      " | " +
      printable.remaining.padEnd(9) +
      " | " +
      printable.used.padEnd(9) +
      " |"
    );
  }
}
