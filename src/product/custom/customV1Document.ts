import { cleanOutString } from "../../parsing/common/summaryHelper";
import {
  StringDict,
  Prediction,
} from "../../parsing/common";
import { ClassificationField, ListField } from "../../parsing/custom";

export class CustomV1Document implements Prediction {
  endpointName = 'custom';
  endpointVersion = '1';
  fields: Map<string, ListField> = new Map();
  classifications: Map<string, ClassificationField> = new Map();

  constructor(rawPrediction: StringDict, pageId?: number) {
    if (rawPrediction) {
      Object.entries(rawPrediction).forEach(([fieldName, fieldValue]: [string, any], idx: number) => {
        this.setField(fieldName, fieldValue, pageId);
      });
    }
  }

  protected setField(
    fieldName: string,
    fieldValue: any,
    pageId?: number
  ) {
    // Currently, two types of fields possible in a custom API response:
    // fields having a list of values, and classification fields.
    if (fieldValue && fieldValue.hasOwnProperty("values")) {
      // Only value lists have the 'values' attribute.
      this.fields.set(
        fieldName,
        new ListField({
          prediction: fieldValue as StringDict,
          pageId: pageId,
        })
      );
    } else if (fieldValue && fieldValue.hasOwnProperty("value")) {
      // Only classifications have the 'value' attribute.
      this.classifications.set(
        fieldName,
        new ClassificationField({ prediction: fieldValue })
      );
    } else {
      throw new Error(`Unknown API field type for field ${fieldName} : ${fieldValue}`);
    }
  }

  toString(): string {
    let outStr = "";
    this.classifications.forEach((fieldData, name) => {
      outStr += `:${name}: ${fieldData}\n`;
    });
    this.fields.forEach((fieldData, name) => {
      outStr += `:${name}: ${fieldData}\n`;
    });
    return cleanOutString(outStr).trimEnd();
  }
}
