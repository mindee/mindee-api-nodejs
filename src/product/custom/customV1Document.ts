import { cleanOutString } from "../../parsing/common/summaryHelper";
import {
  StringDict,
  Prediction,
  PredictionConstructorProps,
} from "../../parsing/common";
import { ClassificationField, ListField } from "../../parsing/custom";

export class CustomV1Document implements Prediction {
  endpointName = 'custom';
  endpointVersion = '1';
  fields: Map<string, ListField> = new Map();
  classifications: Map<string, ClassificationField> = new Map();

  constructor({ rawPrediction, pageId }: PredictionConstructorProps) {
    Object.keys(rawPrediction).forEach((fieldName) => {
      this.setField(fieldName, rawPrediction, pageId);
    });
  }

  protected setField(
    fieldName: string,
    apiPrediction: StringDict,
    pageId: number | undefined
  ) {
    // Currently, two types of fields possible in a custom API response:
    // fields having a list of values, and classification fields.

    const fieldPrediction: StringDict = apiPrediction[fieldName];

    if (fieldPrediction["values"] !== undefined) {
      // Only value lists have the 'values' attribute.
      this.fields.set(
        fieldName,
        new ListField({
          prediction: fieldPrediction,
          pageId: pageId,
        })
      );
    } else if (fieldPrediction["value"] !== undefined) {
      // Only classifications have the 'value' attribute.
      this.classifications.set(
        fieldName,
        new ClassificationField({ prediction: fieldPrediction })
      );
    } else {
      throw "Unknown API field type";
    }
  }

  toString(): string {
    let outStr = "";
    this.classifications.forEach((fieldData, name) => {
      outStr += `\n${name}: ${fieldData}`.trimEnd();
    });
    this.fields.forEach((fieldData, name) => {
      outStr += `\n${name}: ${fieldData}`.trimEnd();
    });
    return cleanOutString(outStr);
  }
}
