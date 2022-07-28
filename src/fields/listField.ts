import { FieldConstructor } from "./field";
import { Polygon, getBboxAsPolygon } from "../geometry";

export class ListFieldItem {
  content: any;
  confidence: number;
  bbox: Polygon = [];
  polygon: Polygon = [];

  constructor(prediction: { [key: string]: any }) {
    this.content = prediction["content"];
    this.confidence = prediction["confidence"];
    if (prediction["polygon"]) {
      this.polygon = prediction["polygon"];
      this.bbox = getBboxAsPolygon(prediction.polygon);
    }
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

  toString(): string {
    let outStr: string = "";
    this.values.forEach((value: ListFieldItem) => {
      outStr += `${value.content} `;
    });
    return outStr.trimEnd();
  }
}
