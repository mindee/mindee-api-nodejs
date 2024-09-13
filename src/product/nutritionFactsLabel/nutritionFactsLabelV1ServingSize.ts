import { floatToString } from "../../parsing/standard";
import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The size of a single serving of the product.
 */
export class NutritionFactsLabelV1ServingSize {
  /** The amount of a single serving. */
  amount: number | undefined;
  /** The unit for the amount of a single serving. */
  unit: string | undefined;
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
    this.unit = prediction["unit"];
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
      unit: this.unit ?? "",
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
      ", Unit: " +
      printable.unit
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Amount: ${printable.amount}
  :Unit: ${printable.unit}`.trimEnd();
  }
}
