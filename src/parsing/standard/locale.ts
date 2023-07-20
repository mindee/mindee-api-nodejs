import { BaseField, BaseFieldConstructor } from "./base";

/**
 * The locale detected on the document.
 */
export class Locale extends BaseField {
  /** Locale in ISO format. */
  value?: string;
  /** The confidence score of the prediction. */
  confidence: number;
  /** ISO 639-1 language code */
  language?: string;
  /** ISO 3166-1 alpha-2 country code */
  country?: string;
  /** ISO 4217 currency code */
  currency?: string;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   */
  constructor({ prediction, reconstructed = false }: BaseFieldConstructor) {
    const valueKey = prediction.value !== undefined ? "value" : "language";
    super({ prediction, valueKey, reconstructed });

    this.confidence = prediction.confidence ? prediction.confidence : 0.0;
    this.language = prediction.hasOwnProperty("language") ? prediction["language"] : undefined;
    this.country = prediction.hasOwnProperty("country") ? prediction["country"] : undefined;
    this.currency = prediction.hasOwnProperty("currency") ? prediction["currency"] : undefined;
  }

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
