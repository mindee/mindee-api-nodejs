import { Document, DocumentConstructorProps } from "./document";
import { ListField } from "./fields";

interface CustomDocConstructorProps extends DocumentConstructorProps {
  documentType: string;
}

export class CustomDocument extends Document {
  fields: { [key: string]: ListField };

  constructor({
    inputFile,
    apiPrediction,
    pageId,
    documentType,
  }: CustomDocConstructorProps) {
    super(documentType, inputFile, pageId);
    this.fields = {};

    Object.keys(apiPrediction).forEach((fieldName) => {
      const fieldPrediction = apiPrediction[fieldName];
      this.fields[fieldName] = new ListField(fieldPrediction, pageId);
    });
  }

  toString(): string {
    let outStr = `----- ${this.documentType} -----`;
    outStr += `\nFilename: ${this.filename}`.trimEnd();
    for (const [name, fieldData] of Object.entries(this.fields)) {
      outStr += `\n${name}: ${fieldData}`.trimEnd();
    }
    outStr += "\n----------------------\n";
    return outStr;
  }
}
