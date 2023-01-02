import { Field, FieldConstructor } from "./field";

export function floatToString(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
    useGrouping: false,
  });
}

export class Amount extends Field {
  /** The value. */
  value?: number;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageId - Page ID for multi-page document
   */
  constructor({
    prediction,
    valueKey = "amount",
    reconstructed = false,
    pageId = undefined,
  }: FieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
    this.value = +parseFloat(prediction[valueKey]).toFixed(3);
    if (isNaN(this.value)) {
      this.value = undefined;
      this.confidence = 0.0;
    }
  }

  toString(): string {
    if (this.value !== undefined) {
      return floatToString(this.value);
    }
    return "";
  }
}
