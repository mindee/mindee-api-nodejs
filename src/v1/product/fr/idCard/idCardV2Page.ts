import { StringDict, cleanOutString } from "@/v1/parsing/common/index.js";
import { ClassificationField } from "@/v1/parsing/standard/index.js";
import { IdCardV2Document } from "./idCardV2Document.js";

/**
 * Carte Nationale d'Identité API version 2.0 page data.
 */
export class IdCardV2Page extends IdCardV2Document {
  /** The sides of the document which are visible. */
  documentSide: ClassificationField;
  /** The document type or format. */
  documentType: ClassificationField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    super(rawPrediction, pageId);

    this.documentSide = new ClassificationField({
      prediction: rawPrediction["document_side"],
    });
    this.documentType = new ClassificationField({
      prediction: rawPrediction["document_type"],
    });
  }

  toString(): string {
    let outStr = `:Document Type: ${this.documentType}
:Document Sides: ${this.documentSide}`.trimEnd();
    outStr += "\n" + super.toString();
    return cleanOutString(outStr);
  }
}
