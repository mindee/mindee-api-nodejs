import { Field } from "@fields/field";

export class Locale extends Field {
  private language: string | undefined;
  private country: string | undefined;
  private currency: string | undefined;
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi pages pdf
   */
  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    pageNumber = 0,
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
}
