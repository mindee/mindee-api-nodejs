import { StringDict } from "@/parsing/common/stringDict.js";

export class RagMetadata {
  /**
   * The UUID of the matched document used during the RAG operation.
   */
  retrievedDocumentId?: string;

  constructor(serverResponse: StringDict) {
    this.retrievedDocumentId = serverResponse["retrieved_document_id"] ?? undefined;
  }
}
