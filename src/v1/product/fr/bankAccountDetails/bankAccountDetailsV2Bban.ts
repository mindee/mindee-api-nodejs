import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

/**
 * Full extraction of BBAN, including: branch code, bank code, account and key.
 */
export class BankAccountDetailsV2Bban {
  /** The BBAN bank code outputted as a string. */
  bbanBankCode: string | null;
  /** The BBAN branch code outputted as a string. */
  bbanBranchCode: string | null;
  /** The BBAN key outputted as a string. */
  bbanKey: string | null;
  /** The BBAN Account number outputted as a string. */
  bbanNumber: string | null;
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
    this.bbanBankCode = prediction["bban_bank_code"];
    this.bbanBranchCode = prediction["bban_branch_code"];
    this.bbanKey = prediction["bban_key"];
    this.bbanNumber = prediction["bban_number"];
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
      bbanBankCode: this.bbanBankCode ?? "",
      bbanBranchCode: this.bbanBranchCode ?? "",
      bbanKey: this.bbanKey ?? "",
      bbanNumber: this.bbanNumber ?? "",
    };
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const printable = this.#printableValues();
    return (
      "Bank Code: " +
      printable.bbanBankCode +
      ", Branch Code: " +
      printable.bbanBranchCode +
      ", Key: " +
      printable.bbanKey +
      ", Account Number: " +
      printable.bbanNumber
    );
  }

  /**
   * Output in a format suitable for inclusion in a field list.
   */
  toFieldList(): string {
    const printable = this.#printableValues();
    return `
  :Bank Code: ${printable.bbanBankCode}
  :Branch Code: ${printable.bbanBranchCode}
  :Key: ${printable.bbanKey}
  :Account Number: ${printable.bbanNumber}`.trimEnd();
  }
}
