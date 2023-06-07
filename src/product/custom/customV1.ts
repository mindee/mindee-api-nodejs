import {
  Document,
  DocumentConstructorProps,
  StringDict,
} from "../../parsing/common";
import { ClassificationField, ListField } from "../../parsing/custom";

export class CustomV1 extends Document {
  fields: Map<string, ListField> = new Map();
  classifications: Map<string, ClassificationField> = new Map();

  constructor({
    inputSource,
    prediction,
    extras = undefined,
    orientation = undefined,
    pageId,
    documentType,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
      extras: extras,
      documentType: documentType,
    });

    Object.keys(prediction).forEach((fieldName) => {
      this.setField(fieldName, prediction, pageId);
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
    let outStr = `----- ${this.docType} -----`;
    outStr += `\nFilename: ${this.filename}`.trimEnd();
    this.classifications.forEach((fieldData, name) => {
      outStr += `\n${name}: ${fieldData}`.trimEnd();
    });
    this.fields.forEach((fieldData, name) => {
      outStr += `\n${name}: ${fieldData}`.trimEnd();
    });
    outStr += "\n----------------------\n";
    return outStr;
  }
}
