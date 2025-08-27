import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The shipping company responsible for transporting the goods.
 */
export class BillOfLadingV1Carrier {
  /** The name of the carrier. */
  name: string | null;
  /** The professional number of the carrier. */
  professionalNumber: string | null;
  /** The Standard Carrier Alpha Code (SCAC) of the carrier. */
  scac: string | null;
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
    this.name = prediction["name"];
    this.professionalNumber = prediction["professional_number"];
    this.scac = prediction["scac"];
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
      name: this.name ?? "",
      professionalNumber: this.professionalNumber ?? "",
      scac: this.scac ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Name: " +
      printable.name +
      ", Professional Number: " +
      printable.professionalNumber +
      ", SCAC: " +
      printable.scac
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Name: ${printable.name}
  :Professional Number: ${printable.professionalNumber}
  :SCAC: ${printable.scac}`.trimEnd();
  }
}
