import { BaseFieldConstructor, Field } from "./field";

export class Locale extends Field {
  /** Locale in ISO format. */
  value?: string;
  /** The language which has been detected */
  language?: string;
  /** The country which has been detected (ISO Alpha-2)*/
  country?: string;
  /** The currency which has been detected.*/
  currency?: string;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   */
  constructor({
    prediction,
    reconstructed = false,
    valueKey = "value",
  }: BaseFieldConstructor) {
    super({ prediction, valueKey, reconstructed });

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
