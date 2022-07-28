import { Field } from "./field";

export class Orientation extends Field {
  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageId - Page ID for multi-page document
   */
  constructor({
    prediction,
    valueKey = "degrees",
    reconstructed = false,
    pageId,
  }: any) {
    const orientations = [0, 90, 180, 270];
    super({ prediction, valueKey, reconstructed, pageId });
    this.value = parseInt(prediction[valueKey]);
    if (isNaN(this.value)) this.confidence = 0.0;
    if (!orientations.includes(this.value)) this.value = 0;
  }
}
