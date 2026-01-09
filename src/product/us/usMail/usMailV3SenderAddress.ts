import { StringDict } from "@/parsing/common/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * The address of the sender.
 */
export class UsMailV3SenderAddress {
  /** The city of the sender's address. */
  city: string | null;
  /** The complete address of the sender. */
  complete: string | null;
  /** The postal code of the sender's address. */
  postalCode: string | null;
  /** Second part of the ISO 3166-2 code, consisting of two letters indicating the US State. */
  state: string | null;
  /** The street of the sender's address. */
  street: string | null;
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
    this.city = prediction["city"];
    this.complete = prediction["complete"];
    this.postalCode = prediction["postal_code"];
    this.state = prediction["state"];
    this.street = prediction["street"];
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
      city: this.city ?? "",
      complete: this.complete ?? "",
      postalCode: this.postalCode ?? "",
      state: this.state ?? "",
      street: this.street ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "City: " +
      printable.city +
      ", Complete Address: " +
      printable.complete +
      ", Postal Code: " +
      printable.postalCode +
      ", State: " +
      printable.state +
      ", Street: " +
      printable.street
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :City: ${printable.city}
  :Complete Address: ${printable.complete}
  :Postal Code: ${printable.postalCode}
  :State: ${printable.state}
  :Street: ${printable.street}`.trimEnd();
  }
}
