import { Field } from "./field";

interface AmountConstructor {
  prediction: any;
  valueKey?: string;
  reconstructed?: boolean;
  pageNumber?: number;
}

export function floatToString(value: number) {
  if (Number.isInteger(value)) {
    return `${value}.0`;
  }
  return value.toString();
}

export class Amount extends Field {
  value: number | undefined;

  /**
   * @param {Object} prediction - Prediction object from HTTP response
   * @param {String} valueKey - Key to use in the prediction dict
   * @param {Boolean} reconstructed - Does the object is reconstructed (not extracted by the API)
   * @param {Integer} pageNumber - Page number for multi-page PDF
   */
  constructor({
    prediction,
    valueKey = "amount",
    reconstructed = false,
    pageNumber = undefined,
  }: AmountConstructor) {
    super({ prediction, valueKey, reconstructed, pageNumber });
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
