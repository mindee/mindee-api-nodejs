import { cleanOutString } from "../../parsing/common";
import { StringDict, Prediction } from "../../parsing/common";
import { ListField } from "../../parsing/custom";

export class CustomV1Page implements Prediction {
  fields: Map<string, ListField> = new Map();

  constructor(rawPrediction: StringDict, pageId?: number) {
    Object.entries(rawPrediction).forEach(
      ([fieldName, fieldValue]: [string, any]) => {
        this.fields.set(
          fieldName,
          new ListField({
            prediction: fieldValue as StringDict,
            pageId: pageId,
          })
        );
      }
    );
  }

  toString(): string {
    let outStr = "";
    this.fields.forEach((fieldData, name) => {
      outStr += `:${name}: ${fieldData}\n`;
    });
    return cleanOutString(outStr).trimEnd();
  }
}
