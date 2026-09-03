import { StringDict } from "@/parsing/stringDict.js";

/** Metadata about the RAG operation. */
export class RagMetadata {
  /**
   * The UUID of the matched document used during the RAG operation.
   */
  retrievedDocumentId?: string;

  constructor(serverResponse: StringDict) {
    this.retrievedDocumentId = serverResponse["retrieved_document_id"] ?? undefined;
  }
}
