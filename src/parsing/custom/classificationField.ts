import { StringDict } from "../common";

export class ClassificationField {
  /** The value for the classification. */
  value: string;
  /**
   * The confidence score of the prediction.
   * Note: Score is calculated on **word selection**, not its textual content (OCR).
   */
  confidence: number;
  pageId?: number;
  constructor({
    prediction,
    pageId,
  }: {
    prediction: StringDict;
    pageId?: number;
  }) {
    this.value = prediction["value"];
    this.confidence = prediction["confidence"];
    this.pageId ??= pageId;
  }

  /**
   * Default string representation.
   */
  toString(): string {
    return `${this.value}`;
  }
}
