import { Document, DocumentConstructorProps } from "./document";
import { ClassificationField, ListField } from "../fields";
import { stringDict } from "../fields";

export interface CustomDocConstructorProps extends DocumentConstructorProps {
  documentType: string;
}

export class CustomDocument extends Document {
  fields: Map<string, ListField> = new Map();
  classifications: Map<string, ClassificationField> = new Map();
  readonly documentType: string;

  constructor({
    inputSource,
    prediction,
    extras = undefined,
    orientation = undefined,
    pageId,
    documentType,
  }: CustomDocConstructorProps) {
    super({ inputSource: inputSource, pageId, orientation, extras });
    this.documentType = documentType;

    Object.keys(prediction).forEach((fieldName) => {
      this.setField(fieldName, prediction, pageId);
    });
  }

  protected setField(
    fieldName: string,
    apiPrediction: stringDict,
    pageId: number | undefined
  ) {
    // Currently, two types of fields possible in a custom API response:
    // fields having a list of values, and classification fields.

    const fieldPrediction: stringDict = apiPrediction[fieldName];

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
    let outStr = `----- ${this.documentType} -----`;
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
