import { StringDict, cleanOutString } from "../../../parsing/common";
import { ClassificationField } from "../../../parsing/standard";

import { IdCardV1Document } from "./idCardV1Document";

/**
 * Carte Nationale d'Identité API version 1.1 page data.
 */
export class IdCardV1Page extends IdCardV1Document {
  /** The side of the document which is visible. */
  documentSide: ClassificationField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    super(rawPrediction, pageId);

    this.documentSide = new ClassificationField({
      prediction: rawPrediction["document_side"],
    });
  }

  toString(): string {
    let outStr = `:Document Side: ${this.documentSide}`.trimEnd();
    outStr += "\n" + super.toString();
    return cleanOutString(outStr);
  }
}
