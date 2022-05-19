import { Document } from "./document";
import { ListField } from "./fields";

export class CustomDocument extends Document {
  fields: { [key: string]: any };
  pageId: number;

  constructor({ inputFile, prediction, pageId, documentType }: any) {
    super(documentType, inputFile);
    this.fields = {};
    this.pageId = pageId;

    Object.keys(prediction).forEach((fieldName) => {
      const fieldPrediction = prediction[fieldName];
      this.fields[fieldName] = new ListField(fieldPrediction, pageId);
    });
  }

  toString(): string {
    let outStr = `----- ${this.documentType} -----\n`;
    for (const [name, info] of Object.entries(this.fields)) {
      const valuesList: any[] = [];
      info.values.forEach((value: any) => {
        valuesList.push(value.content);
      });
      if (valuesList.length === 0) {
        outStr += `${name}:\n`;
      } else {
        outStr += `${name}: ${valuesList.join(" ")}\n`;
      }
    }
    outStr += "----------------------\n";
    return outStr;
  }
}
