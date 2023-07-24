import { BaseField, BaseFieldConstructor } from "./base";

/**
 * Represents a classifier value.
 */
export class ClassificationField extends BaseField {
  /** The confidence score of the prediction. */
  confidence: number;
  /** The classification. */
  value?: string;

  constructor({
    prediction = {},
    valueKey = "value",
    reconstructed = false,
  }: BaseFieldConstructor) {
    super({ prediction, valueKey, reconstructed });
    this.confidence = prediction["confidence"] ? prediction["confidence"] : 0.0;
  }
}
