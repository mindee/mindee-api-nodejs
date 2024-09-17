
import { floatToString } from "../../parsing/common";
import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The amount of protein in the product.
 */
export class NutritionFactsLabelV1Protein {
  /** DVs are the recommended amounts of protein to consume or not to exceed each day. */
  dailyValue: number | null;
  /** The amount of protein per 100g of the product. */
  per100G: number | null;
  /** The amount of protein per serving of the product. */
  perServing: number | null;
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
    if (
      prediction["daily_value"] !== undefined &&
      prediction["daily_value"] !== null &&
      !isNaN(prediction["daily_value"])
    ) {
      this.dailyValue = +parseFloat(prediction["daily_value"]);
    } else {
      this.dailyValue = null;
    }
    if (
      prediction["per_100g"] !== undefined &&
      prediction["per_100g"] !== null &&
      !isNaN(prediction["per_100g"])
    ) {
      this.per100G = +parseFloat(prediction["per_100g"]);
    } else {
      this.per100G = null;
    }
    if (
      prediction["per_serving"] !== undefined &&
      prediction["per_serving"] !== null &&
      !isNaN(prediction["per_serving"])
    ) {
      this.perServing = +parseFloat(prediction["per_serving"]);
    } else {
      this.perServing = null;
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
      dailyValue:
        this.dailyValue !== undefined ? floatToString(this.dailyValue) : "",
      per100G: this.per100G !== undefined ? floatToString(this.per100G) : "",
      perServing:
        this.perServing !== undefined ? floatToString(this.perServing) : "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Daily Value: " +
      printable.dailyValue +
      ", Per 100g: " +
      printable.per100G +
      ", Per Serving: " +
      printable.perServing
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Daily Value: ${printable.dailyValue}
  :Per 100g: ${printable.per100G}
  :Per Serving: ${printable.perServing}`.trimEnd();
  }
}
