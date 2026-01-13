import { Field } from "./field.js";
import { BaseFieldConstructor } from "./base.js";
import { floatToString } from "@/v1/parsing/common/index.js";

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
    this.value = +parseFloat(prediction[valueKey]);
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
