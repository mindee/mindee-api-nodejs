import { Field } from "./field";

export class Locale extends Field {
  language: string | undefined;
  country: string | undefined;
  currency: string | undefined;
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi-page PDF
   */
  constructor({
    prediction,
    reconstructed = false,
    pageNumber = undefined,
    valueKey = "value",
  }: any) {
    super({ prediction, valueKey, reconstructed, pageNumber });

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
