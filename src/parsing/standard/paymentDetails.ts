import { StringDict } from "../common";
import { Field } from "./field";

interface PaymentDetailsConstructor {
  prediction: StringDict;
  valueKey?: string;
  accountNumberKey?: string;
  ibanKey?: string;
  routingNumberKey?: string;
  swiftKey?: string;
  reconstructed?: boolean;
  pageId?: number;
}

/**
 * Information on a single payment.
 */
export class PaymentDetails extends Field {
  /** Synonym for the `iban` property */
  value?: string | undefined;
  /** The account number. */
  accountNumber: string | undefined;
  /** The International Bank Account Number (IBAN). */
  iban: string | undefined;
  /** The routing number. */
  routingNumber: string | undefined;
  /** The bank's SWIFT Business Identifier Code (BIC). */
  swift: string | undefined;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict to get the iban
   * @param {String} accountNumberKey - Key to use to get the account number in the prediction dict
   * @param {String} ibanKey - Key to use to get the IBAN in the prediction dict
   * @param {String} routingNumberKey - Key to use to get the routing number in the prediction dict
   * @param {String} swiftKey - Key to use to get the SWIFT in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageId - Page ID for multi-page document
   */
  constructor({
    prediction,
    valueKey = "iban",
    accountNumberKey = "account_number",
    ibanKey = "iban",
    routingNumberKey = "routing_number",
    swiftKey = "swift",
    reconstructed = false,
    pageId = undefined,
  }: PaymentDetailsConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });

    this.accountNumber = undefined;
    this.iban = undefined;
    this.routingNumber = undefined;
    this.swift = undefined;

    if (PaymentDetails.#isKeySet(prediction[accountNumberKey])) {
      this.accountNumber = prediction[accountNumberKey];
    }
    if (PaymentDetails.#isKeySet(prediction[ibanKey])) {
      this.iban = prediction[ibanKey];
    }
    if (PaymentDetails.#isKeySet(prediction[routingNumberKey])) {
      this.routingNumber = prediction[routingNumberKey];
    }
    if (PaymentDetails.#isKeySet(prediction[swiftKey])) {
      this.swift = prediction[swiftKey];
    }
  }

  static #isKeySet(value: any): boolean {
    return typeof value === "string" && value !== "N/A";
  }

  toString(): string {
    let str = "";
    if (this.accountNumber !== undefined) {
      str += `${this.accountNumber}; `;
    }
    if (this.iban !== undefined) {
      str += `${this.iban}; `;
    }
    if (this.routingNumber !== undefined) {
      str += `${this.routingNumber}; `;
    }
    if (this.swift !== undefined) {
      str += `${this.swift}; `;
    }
    return str;
  }
}
