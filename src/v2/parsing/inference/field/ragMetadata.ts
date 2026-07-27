import { StringDict } from "@/parsing/stringDict.js";

/** Metadata produced by RAG-enabled extraction. */
export class RagMetadata {
  /**
   * The UUID of the matched document used during the RAG operation.
   */
  retrievedDocumentId?: string;

  constructor(serverResponse: StringDict) {
    this.retrievedDocumentId = serverResponse["retrieved_document_id"] ?? undefined;
  }
}
