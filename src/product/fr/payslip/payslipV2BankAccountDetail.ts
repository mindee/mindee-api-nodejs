import { cleanSpaces } from "../../../parsing/common/summaryHelper";
import { StringDict } from "../../../parsing/common";
import { Polygon } from "../../../geometry";

/**
 * Information about the employee's bank account.
 */
export class PayslipV2BankAccountDetail {
  /** The name of the bank. */
  bankName: string | undefined;
  /** The IBAN of the bank account. */
  iban: string | undefined;
  /** The SWIFT code of the bank. */
  swift: string | undefined;
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
    this.bankName = prediction["bank_name"];
    this.iban = prediction["iban"];
    this.swift = prediction["swift"];
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
      bankName: this.bankName ?? "",
      iban: this.iban ?? "",
      swift: this.swift ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Bank Name: " +
      printable.bankName +
      ", IBAN: " +
      printable.iban +
      ", SWIFT: " +
      printable.swift
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Bank Name: ${printable.bankName}
  :IBAN: ${printable.iban}
  :SWIFT: ${printable.swift}`.trimEnd();
  }
}
