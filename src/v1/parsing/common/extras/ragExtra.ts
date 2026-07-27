import { ExtraField } from "./extras.js";
import { StringDict } from "@/parsing/stringDict.js";

/** RAG extra payload returned by compatible APIs. */
export class RAGExtra extends ExtraField {
  /**
   * ID reference of the document matched by the Retrieval-Augmented Generation.
   */
  matchingDocumentId?: string;

  constructor(rawPrediction: StringDict) {
    super();
    if (rawPrediction["matching_document_id"]) {
      this.matchingDocumentId = rawPrediction["matching_document_id"];
    }
  }
}
