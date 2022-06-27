export class ListFieldItem {
  content: any;
  confidence: number;
  polygon: any;

  constructor(prediction: { [key: string]: any }) {
    this.content = prediction["content"];
    this.confidence = prediction["confidence"];
    this.polygon = prediction["polygon"];
  }
}

export class ListField {
  values: ListFieldItem[];
  confidence: number;
  reconstructed: boolean;
  pageId?: number;

  constructor(
    prediction: { [key: string]: any },
    pageId: number | undefined,
    constructed = false
  ) {
    this.values = [];
    this.confidence = prediction["confidence"];
    this.reconstructed = constructed;
    this.pageId = pageId;

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
