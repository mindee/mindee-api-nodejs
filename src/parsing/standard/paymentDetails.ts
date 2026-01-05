import { StringDict } from "@/parsing/common/stringDict.js";
import { Field } from "./field.js";

/**
 * @property {StringDict} constructor.prediction - Prediction object from HTTP response
 * @property {string} constructor.valueKey - Key to use in the prediction dict to get the iban.
 * @property {string} constructor.accountNumberKey - Key to use to get the account number in the prediction dict.
 * @property {string} constructor.ibanKey - Key to use to get the IBAN in the prediction dict.
 * @property {string} constructor.routingNumberKey - Key to use to get the routing number in the prediction dict.
 * @property {string} constructor.swiftKey - Key to use to get the SWIFT in the prediction dict.
 * @property {boolean} constructor.reconstructed - Is the object reconstructed (not extracted by the API).
 * @property {number} constructor.pageId - Page ID for multi-page document.
 */
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
export class PaymentDetailsField extends Field {
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
   * @param {PaymentDetailsConstructor} constructor Constructor parameters.
   */
  constructor({
    prediction = {},
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

    if (PaymentDetailsField.#isKeySet(prediction[accountNumberKey])) {
      this.accountNumber = prediction[accountNumberKey];
    }
    if (PaymentDetailsField.#isKeySet(prediction[ibanKey])) {
      this.iban = prediction[ibanKey];
    }
    if (PaymentDetailsField.#isKeySet(prediction[routingNumberKey])) {
      this.routingNumber = prediction[routingNumberKey];
    }
    if (PaymentDetailsField.#isKeySet(prediction[swiftKey])) {
      this.swift = prediction[swiftKey];
    }
  }

  static #isKeySet(value: any): boolean {
    return typeof value === "string" && value !== "N/A";
  }

  /**
   * Default string representation.
   */
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
