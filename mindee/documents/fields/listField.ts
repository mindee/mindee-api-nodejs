export class ListFieldItem {
  content: any;
  confidence: number;
  polygon: any;

  constructor(prediction: any) {
    this.content = prediction["content"];
    this.confidence = prediction["confidence"];
    this.polygon = prediction["polygon"];
  }
}

export class ListField {
  values: any[];
  confidence: number;
  constructed: boolean;
  pageId: number;

  constructor(
    prediction: { [key: string]: any },
    pageId: number,
    constructed = false
  ) {
    this.values = [];
    this.confidence = prediction["confidence"];
    this.constructed = constructed;
    this.pageId = pageId;

    if (Object.prototype.hasOwnProperty.call(prediction, "values")) {
      prediction["values"].forEach((field: any) => {
        this.values.push(new ListFieldItem(field));
      });
    }
  }
}
