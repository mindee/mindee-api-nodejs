import { BaseField, BaseFieldConstructor } from "./base";

/**
 * The locale detected on the document.
 */
export class LocaleField extends BaseField {
  /** Locale in ISO format. */
  value?: string;
  /** The confidence score of the prediction. */
  confidence: number;
  /** ISO 639-1 language code */
  language?: string;
  /** ISO 3166-1 alpha-2 (or alpha-3) country code */
  country?: string;
  /** ISO 4217 currency code */
  currency?: string;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {boolean} reconstructed - Is the object reconstructed (not extracted by the API)
   */
  constructor({
    prediction = {},
    reconstructed = false,
    pageId=undefined,
  }: BaseFieldConstructor) {
    const valueKey = prediction["value"] !== undefined ? "value" : "language";
    super({ prediction, valueKey, reconstructed, pageId });

    this.confidence = prediction["confidence"] ? prediction["confidence"] : 0.0;
    this.language =
      prediction["language"] !== undefined ? prediction["language"] : undefined;
    this.country =
      prediction["country"] !== undefined ? prediction["country"] : undefined;
    this.currency =
      prediction["currency"] !== undefined ? prediction["currency"] : undefined;
  }

  /**
   * Default string representation.
   */
  toString(): string {
    let outStr = "";
    if (this.value) {
      outStr += `${this.value}; `;
    }
    if (this.language) {
      outStr += `${this.language}; `;
    }
    if (this.country) {
      outStr += `${this.country}; `;
    }
    if (this.currency) {
      outStr += `${this.currency};`;
    }
    return outStr.trimEnd();
  }
}
