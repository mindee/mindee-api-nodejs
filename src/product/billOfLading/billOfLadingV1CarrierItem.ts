import { cleanSpecialChars, floatToString } from "../../parsing/common";
import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The goods being shipped.
 */
export class BillOfLadingV1CarrierItem {
  /** A description of the item. */
  description: string | null;
  /** The gross weight of the item. */
  grossWeight: number | null;
  /** The measurement of the item. */
  measurement: number | null;
  /** The unit of measurement for the measurement. */
  measurementUnit: string | null;
  /** The quantity of the item being shipped. */
  quantity: number | null;
  /** The unit of measurement for weights. */
  weightUnit: string | null;
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
    if (
      prediction["gross_weight"] !== undefined &&
      prediction["gross_weight"] !== null &&
      !isNaN(prediction["gross_weight"])
    ) {
      this.grossWeight = +parseFloat(prediction["gross_weight"]);
    } else {
      this.grossWeight = null;
    }
    if (
      prediction["measurement"] !== undefined &&
      prediction["measurement"] !== null &&
      !isNaN(prediction["measurement"])
    ) {
      this.measurement = +parseFloat(prediction["measurement"]);
    } else {
      this.measurement = null;
    }
    this.measurementUnit = prediction["measurement_unit"];
    if (
      prediction["quantity"] !== undefined &&
      prediction["quantity"] !== null &&
      !isNaN(prediction["quantity"])
    ) {
      this.quantity = +parseFloat(prediction["quantity"]);
    } else {
      this.quantity = null;
    }
    this.weightUnit = prediction["weight_unit"];
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
      grossWeight:
        this.grossWeight !== undefined ? floatToString(this.grossWeight) : "",
      measurement:
        this.measurement !== undefined ? floatToString(this.measurement) : "",
      measurementUnit: this.measurementUnit ?
        this.measurementUnit.length <= 16 ?
          cleanSpecialChars(this.measurementUnit) :
          cleanSpecialChars(this.measurementUnit).slice(0, 13) + "..." :
        "",
      quantity: this.quantity !== undefined ? floatToString(this.quantity) : "",
      weightUnit: this.weightUnit ?
        this.weightUnit.length <= 11 ?
          cleanSpecialChars(this.weightUnit) :
          cleanSpecialChars(this.weightUnit).slice(0, 8) + "..." :
        "",
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
      ", Gross Weight: " +
      printable.grossWeight +
      ", Measurement: " +
      printable.measurement +
      ", Measurement Unit: " +
      printable.measurementUnit +
      ", Quantity: " +
      printable.quantity +
      ", Weight Unit: " +
      printable.weightUnit
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
      printable.grossWeight.padEnd(12) +
      " | " +
      printable.measurement.padEnd(11) +
      " | " +
      printable.measurementUnit.padEnd(16) +
      " | " +
      printable.quantity.padEnd(8) +
      " | " +
      printable.weightUnit.padEnd(11) +
      " |"
    );
  }
}
