import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Information about the energy meter.
 */
export class EnergyBillV1MeterDetail {
  /** The unique identifier of the energy meter. */
  meterNumber: string | null;
  /** The type of energy meter. */
  meterType: string | null;
  /** The unit of measurement for energy consumption, which can be kW, m³, or L. */
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
    this.meterNumber = prediction["meter_number"];
    this.meterType = prediction["meter_type"];
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
      meterNumber: this.meterNumber ?? "",
      meterType: this.meterType ?? "",
      unit: this.unit ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Meter Number: " +
      printable.meterNumber +
      ", Meter Type: " +
      printable.meterType +
      ", Unit of Measure: " +
      printable.unit
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Meter Number: ${printable.meterNumber}
  :Meter Type: ${printable.meterType}
  :Unit of Measure: ${printable.unit}`.trimEnd();
  }
}
