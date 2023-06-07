import { StringDict } from "../common";

export class ClassificationField {
  /** The value for the classification. */
  value: string;
  /**
   * The confidence score of the prediction.
   * Note: Score is calculated on **word selection**, not its textual content (OCR).
   */
  confidence: number;

  constructor({ prediction }: { prediction: StringDict }) {
    this.value = prediction["value"];
    this.confidence = prediction["confidence"];
  }

  toString(): string {
    return `${this.value}`;
  }
}
