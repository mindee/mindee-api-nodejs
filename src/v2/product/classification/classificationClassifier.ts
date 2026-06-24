import { StringDict } from "@/parsing/index.js";
import { ExtractionResponse } from "@/v2/product/extraction/index.js";

/**
 * Document level classification.
 */
export class ClassificationClassifier {
  /**
   * The document type, as identified on given classification values.
   */
  documentType: string;
  /**
   * The extraction response associated with the classification.
   */
  extractionResponse?: ExtractionResponse;

  constructor(serverResponse: StringDict) {
    this.documentType = serverResponse["document_type"];
    this.extractionResponse = serverResponse["extraction_response"]
      ? new ExtractionResponse(serverResponse["extraction_response"])
      : undefined;
  }

  toString(): string {
    return `Document Type: ${this.documentType}`;
  }
}
