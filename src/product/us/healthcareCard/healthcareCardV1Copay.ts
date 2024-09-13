import { floatToString } from "../../../parsing/standard";
import { cleanSpaces } from "../../../parsing/common/summaryHelper";
import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Is a fixed amount for a covered service.
 */
export class HealthcareCardV1Copay {
  /** The price of service. */
  serviceFees: number | undefined;
  /** The name of service of the copay. */
  serviceName: string | undefined;
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
    if (prediction["service_fees"] && !isNaN(prediction["service_fees"])) {
      this.serviceFees = +parseFloat(prediction["service_fees"]).toFixed(3);
    }
    this.serviceName = prediction["service_name"];
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
      serviceFees:
        this.serviceFees !== undefined ? floatToString(this.serviceFees) : "",
      serviceName: this.serviceName ?
        this.serviceName.length <= 12 ?
          cleanSpaces(this.serviceName) :
          cleanSpaces(this.serviceName).slice(0, 9) + "..." :
        "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Service Fees: " +
      printable.serviceFees +
      ", Service Name: " +
      printable.serviceName
    );
  }
  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.serviceFees.padEnd(12) +
      " | " +
      printable.serviceName.padEnd(12) +
      " |"
    );
  }
}
