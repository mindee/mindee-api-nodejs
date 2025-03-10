import { StringDict } from "../../parsing/common";
import { Polygon } from "../../geometry";

/**
 * The party responsible for shipping the goods.
 */
export class BillOfLadingV1Shipper {
  /** The address of the shipper. */
  address: string | null;
  /** The  email of the shipper. */
  email: string | null;
  /** The name of the shipper. */
  name: string | null;
  /** The phone number of the shipper. */
  phone: string | null;
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
