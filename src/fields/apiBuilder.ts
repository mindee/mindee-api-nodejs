import { FieldConstructor, StringDict } from "./field";
import { Polygon, getBboxAsPolygon } from "../geometry";

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

export class ListFieldValue {
  content: any;
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
      this.bbox = getBboxAsPolygon(prediction.polygon);
    }
  }

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
  pageId: number;

  constructor({ prediction, reconstructed = false, pageId }: FieldConstructor) {
    this.values = [];
    this.confidence = prediction["confidence"];
    this.reconstructed = reconstructed;
    this.pageId = pageId !== undefined ? pageId : prediction["page_id"];

    if (Object.prototype.hasOwnProperty.call(prediction, "values")) {
      prediction["values"].forEach((field: any) => {
        this.values.push(new ListFieldValue(field));
      });
    }
  }

  contentsList(): Array<any> {
    return this.values.map((item) => item.content);
  }

  contentsString(separator: string = " "): string {
    return this.values.map((item) => `${item.content}`).join(separator);
  }

  toString(): string {
    return this.contentsString();
  }
}
