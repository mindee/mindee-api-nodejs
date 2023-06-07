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
    this.language = undefined;
    this.country = undefined;
    this.currency = undefined;
    if ("language" in prediction && prediction.language !== "N/A")
      this.language = prediction.language;
    if ("country" in prediction && prediction.country !== "N/A")
      this.country = prediction.country;
    if ("currency" in prediction && prediction.currency !== "N/A")
      this.currency = prediction.currency;
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
