import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * The address of the sender.
 */
export class UsMailV2SenderAddress {
  /** The city of the sender's address. */
  city: string | undefined;
  /** The complete address of the sender. */
  complete: string | undefined;
  /** The postal code of the sender's address. */
  postalCode: string | undefined;
  /** Second part of the ISO 3166-2 code, consisting of two letters indicating the US State. */
  state: string | undefined;
  /** The street of the sender's address. */
  street: string | undefined;
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
      city: this.city ?
        this.city.length <= 15 ?
          this.city :
          this.city.slice(0, 12) + "..." :
        "",
      complete: this.complete ?
        this.complete.length <= 35 ?
          this.complete :
          this.complete.slice(0, 32) + "..." :
        "",
      postalCode: this.postalCode ?
        this.postalCode.length <= 11 ?
          this.postalCode :
          this.postalCode.slice(0, 8) + "..." :
        "",
      state: this.state ?
        this.state.length <= 5 ?
          this.state :
          this.state.slice(0, 2) + "..." :
        "",
      street: this.street ?
        this.street.length <= 25 ?
          this.street :
          this.street.slice(0, 22) + "..." :
        "",
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
