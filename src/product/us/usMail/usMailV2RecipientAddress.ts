import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * The addresses of the recipients.
 */
export class UsMailV2RecipientAddress {
  /** The city of the recipient's address. */
  city: string | undefined;
  /** The complete address of the recipient. */
  complete: string | undefined;
  /** Indicates if the recipient's address is a change of address. */
  isAddressChange: boolean | undefined;
  /** The postal code of the recipient's address. */
  postalCode: string | undefined;
  /** The private mailbox number of the recipient's address. */
  privateMailboxNumber: string | undefined;
  /** Second part of the ISO 3166-2 code, consisting of two letters indicating the US State. */
  state: string | undefined;
  /** The street of the recipient's address. */
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
    this.isAddressChange = prediction["is_address_change"];
    this.postalCode = prediction["postal_code"];
    this.privateMailboxNumber = prediction["private_mailbox_number"];
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
      isAddressChange: this.isAddressChange === true ?
        "True" : this.isAddressChange === false ?
          "False" :
          "",
      postalCode: this.postalCode ?
        this.postalCode.length <= 11 ?
          this.postalCode :
          this.postalCode.slice(0, 8) + "..." :
        "",
      privateMailboxNumber: this.privateMailboxNumber ?
        this.privateMailboxNumber.length <= 22 ?
          this.privateMailboxNumber :
          this.privateMailboxNumber.slice(0, 19) + "..." :
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
      ", Is Address Change: " +
      printable.isAddressChange +
      ", Postal Code: " +
      printable.postalCode +
      ", Private Mailbox Number: " +
      printable.privateMailboxNumber +
      ", State: " +
      printable.state +
      ", Street: " +
      printable.street
    );
  }
  /**
   * Output in a format suitable for inclusion in an rST table.
   */
  toTableLine(): string {
    const printable = this.#printableValues();
    return (
      "| " +
      printable.city.padEnd(15) +
      " | " +
      printable.complete.padEnd(35) +
      " | " +
      printable.isAddressChange.padEnd(17) +
      " | " +
      printable.postalCode.padEnd(11) +
      " | " +
      printable.privateMailboxNumber.padEnd(22) +
      " | " +
      printable.state.padEnd(5) +
      " | " +
      printable.street.padEnd(25) +
      " |"
    );
  }
}
