import { cleanSpecialChars, floatToString } from "../../parsing/common";
import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The amount of nutrients in the product.
 */
export class NutritionFactsLabelV1Nutrient {
  /** DVs are the recommended amounts of nutrients to consume or not to exceed each day. */
  dailyValue: number | null;
  /** The name of nutrients of the product. */
  name: string | null;
  /** The amount of nutrients per 100g of the product. */
  per100G: number | null;
  /** The amount of nutrients per serving of the product. */
  perServing: number | null;
  /** The unit of measurement for the amount of nutrients. */
  unit: string | null;
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
    this.name = prediction["name"];
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
      dailyValue:
        this.dailyValue !== undefined ? floatToString(this.dailyValue) : "",
      name: this.name ?
        this.name.length <= 20 ?
          cleanSpecialChars(this.name) :
          cleanSpecialChars(this.name).slice(0, 17) + "..." :
        "",
      per100G: this.per100G !== undefined ? floatToString(this.per100G) : "",
      perServing:
        this.perServing !== undefined ? floatToString(this.perServing) : "",
      unit: this.unit ?
        this.unit.length <= 4 ?
          cleanSpecialChars(this.unit) :
          cleanSpecialChars(this.unit).slice(0, 1) + "..." :
        "",
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
      ", Name: " +
      printable.name +
      ", Per 100g: " +
      printable.per100G +
      ", Per Serving: " +
      printable.perServing +
      ", Unit: " +
      printable.unit
    );
  }

  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.dailyValue.padEnd(11) +
      " | " +
      printable.name.padEnd(20) +
      " | " +
      printable.per100G.padEnd(8) +
      " | " +
      printable.perServing.padEnd(11) +
      " | " +
      printable.unit.padEnd(4) +
      " |"
    );
  }
}
