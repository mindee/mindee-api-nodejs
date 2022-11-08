import { BaseField, BaseFieldConstructor } from "./field";

interface OrientationFieldConstructor extends BaseFieldConstructor {
  pageId: number;
}

export class OrientationField extends BaseField {
  /* Degrees of the rotation. */
  value: number;
  /* Page id. */
  pageId: number;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageId - Page ID for multi-page document
   */
  constructor({
    prediction,
    valueKey = "value",
    reconstructed = false,
    pageId,
  }: OrientationFieldConstructor) {
    super({ prediction, valueKey, reconstructed });
    const orientations = [0, 90, 180, 270];
    this.pageId = pageId;
    this.value = parseInt(prediction[valueKey]);
    if (!orientations.includes(this.value)) this.value = 0;
  }

  toString() {
    return `${this.value} degrees`;
  }
}
