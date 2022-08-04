import { FieldConstructor, stringDict } from "./field";
import { Polygon, getBboxAsPolygon } from "../geometry";

export class ClassificationField {
  value: string;
  confidence: number;

  constructor({ prediction }: { prediction: stringDict }) {
    this.value = prediction["value"];
    this.confidence = prediction["confidence"];
  }

  toString(): string {
    return `${this.value}`;
  }
}

export class ListFieldItem {
  content: any;
  confidence: number;
  bbox: Polygon = [];
  polygon: Polygon = [];

  constructor(prediction: stringDict) {
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
  values: ListFieldItem[];
  confidence: number;
  reconstructed: boolean;
  pageId?: number;

  constructor({ prediction, reconstructed = false, pageId }: FieldConstructor) {
    this.values = [];
    this.confidence = prediction["confidence"];
    this.reconstructed = reconstructed;
    this.pageId = pageId !== undefined ? pageId : prediction["page_id"];

    if (Object.prototype.hasOwnProperty.call(prediction, "values")) {
      prediction["values"].forEach((field: any) => {
        this.values.push(new ListFieldItem(field));
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
