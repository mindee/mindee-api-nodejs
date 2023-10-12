import { Field } from "./field";
import { BaseFieldConstructor } from "./base";

export function floatToString(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
    useGrouping: false,
  });
}

/**
 * A field containing an amount value.
 */
export class AmountField extends Field {
  /** The value. */
  value?: number = undefined;

  /**
   * @param {BaseFieldConstructor} constructor Constructor parameters.
   */
  constructor({
    prediction = {},
    valueKey = "value",
    reconstructed = false,
    pageId = undefined,
  }: BaseFieldConstructor) {
    super({ prediction, valueKey, reconstructed, pageId });
    this.value = +parseFloat(prediction[valueKey]).toFixed(3);
    if (isNaN(this.value)) {
      this.value = undefined;
      this.confidence = 0.0;
    }
  }

  /**
   * Default string representation.
   */
  toString(): string {
    if (this.value !== undefined) {
      return floatToString(this.value);
    }
    return "";
  }
}
