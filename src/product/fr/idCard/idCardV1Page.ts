import { cleanOutString, StringDict } from "../../../parsing/common";
import { ClassificationField } from "../../../parsing/custom";
import { IdCardV1Document } from "./idCardV1Document";

export class IdCardV1Page extends IdCardV1Document {
  documentSide: ClassificationField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    super(rawPrediction, pageId);

    this.documentSide = new ClassificationField({
      prediction: rawPrediction["document_side"],
      pageId: pageId,
    });
  }

  toString(): string {
    let outStr = `:Document Side: ${this.documentSide.toString()}
`;
    outStr += super.toString();
    return cleanOutString(outStr);
  }
}
