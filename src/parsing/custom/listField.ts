import { BaseFieldConstructor } from "../standard";
import { Polygon, getBoundingBox } from "../../geometry";
import { StringDict } from "../common";

export class ListFieldValue {
  /** Extracted content of the prediction */
  content: string;
  /**
   * The confidence score of the prediction.
   * Note: Score is calculated on **word selection**, not its textual content (OCR).
   */
  confidence: number;
  /**
   * Contains exactly 4 relative vertices coordinates (points) of a right
   * rectangle containing the word in the document.
   */
  bbox: Polygon = [];
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the word in the document.
   */
  polygon: Polygon = [];

  constructor(prediction: StringDict) {
    this.content = prediction["content"];
    this.confidence = prediction["confidence"];
    if (prediction["polygon"]) {
      this.polygon = prediction["polygon"];
      this.bbox = getBoundingBox(prediction["polygon"]);
    }
  }

  /**
   * Default string representation.
   */
  toString(): string {
    return `${this.content}`;
  }
}

export class ListField {
  readonly values: ListFieldValue[];
  confidence: number;
  /** True if the field was reconstructed or computed using other fields. */
  reconstructed: boolean;
  /** The document page on which the information was found. */
  pageId?: number;

  /**
   * @param {BaseFieldConstructor} constructor Constructor parameters.
   */
  constructor({
    prediction = {},
    reconstructed = false,
    pageId,
  }: BaseFieldConstructor) {
    this.values = [];
    this.confidence = prediction["confidence"];
    this.reconstructed = reconstructed;
    if (prediction["page_id"]) {
      this.pageId = pageId !== undefined ? pageId : prediction["page_id"];
    } else {
      this.pageId = undefined;
    }

    if (prediction["values"] !== undefined) {
      prediction["values"].forEach((field: StringDict) => {
        if (field["page_id"] && field["page_id"] !== null) {
          this.pageId = field["page_id"];
        }
        this.values.push(new ListFieldValue(field));
      });
    }
  }

  contentsList(): Array<string | number> {
    return this.values.map((item) => item.content);
  }

  contentsString(separator: string = " "): string {
    return this.values.map((item) => `${item.content}`).join(separator);
  }

  /**
   * Default string representation.
   */
  toString(): string {
    return this.contentsString();
  }
}
