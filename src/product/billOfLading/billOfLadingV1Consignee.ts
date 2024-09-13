import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The party to whom the goods are being shipped.
 */
export class BillOfLadingV1Consignee {
  /** The address of the consignee. */
  address: string | undefined;
  /** The  email of the shipper. */
  email: string | undefined;
  /** The name of the consignee. */
  name: string | undefined;
  /** The phone number of the consignee. */
  phone: string | undefined;
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
    this.address = prediction["address"];
    this.email = prediction["email"];
    this.name = prediction["name"];
    this.phone = prediction["phone"];
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
      address: this.address ?? "",
      email: this.email ?? "",
      name: this.name ?? "",
      phone: this.phone ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Address: " +
      printable.address +
      ", Email: " +
      printable.email +
      ", Name: " +
      printable.name +
      ", Phone: " +
      printable.phone
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Address: ${printable.address}
  :Email: ${printable.email}
  :Name: ${printable.name}
  :Phone: ${printable.phone}`.trimEnd();
  }
}
