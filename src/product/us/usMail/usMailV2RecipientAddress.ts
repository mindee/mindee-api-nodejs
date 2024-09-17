
import { cleanSpecialChars } from "../../../parsing/common";
import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * The addresses of the recipients.
 */
export class UsMailV2RecipientAddress {
  /** The city of the recipient's address. */
  city: string | null;
  /** The complete address of the recipient. */
  complete: string | null;
  /** Indicates if the recipient's address is a change of address. */
  isAddressChange: boolean | null;
  /** The postal code of the recipient's address. */
  postalCode: string | null;
  /** The private mailbox number of the recipient's address. */
  privateMailboxNumber: string | null;
  /** Second part of the ISO 3166-2 code, consisting of two letters indicating the US State. */
  state: string | null;
  /** The street of the recipient's address. */
  street: string | null;
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
          cleanSpecialChars(this.city) :
          cleanSpecialChars(this.city).slice(0, 12) + "..." :
        "",
      complete: this.complete ?
        this.complete.length <= 35 ?
          cleanSpecialChars(this.complete) :
          cleanSpecialChars(this.complete).slice(0, 32) + "..." :
        "",
      isAddressChange: this.isAddressChange === true ?
        "True" :
        this.isAddressChange === false ?
          "False" :
          "",
      postalCode: this.postalCode ?
        this.postalCode.length <= 11 ?
          cleanSpecialChars(this.postalCode) :
          cleanSpecialChars(this.postalCode).slice(0, 8) + "..." :
        "",
      privateMailboxNumber: this.privateMailboxNumber ?
        this.privateMailboxNumber.length <= 22 ?
          cleanSpecialChars(this.privateMailboxNumber) :
          cleanSpecialChars(this.privateMailboxNumber).slice(0, 19) + "..." :
        "",
      state: this.state ?
        this.state.length <= 5 ?
          cleanSpecialChars(this.state) :
          cleanSpecialChars(this.state).slice(0, 2) + "..." :
        "",
      street: this.street ?
        this.street.length <= 25 ?
          cleanSpecialChars(this.street) :
          cleanSpecialChars(this.street).slice(0, 22) + "..." :
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
