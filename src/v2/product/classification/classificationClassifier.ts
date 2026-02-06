import { StringDict } from "@/parsing/index.js";

/**
 * Document level classification.
 */
export class ClassificationClassifier {
  documentType: string;

  constructor(serverResponse: StringDict) {
    this.documentType = serverResponse["document_type"];
  }

  toString(): string {
    return `Document Type: ${this.documentType}`;
  }
}
