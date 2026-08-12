import { StringDict } from "@/parsing/index.js";
import { BaseSearchResponse } from "./baseSearchResponse.js";
import { RagDocuments } from "@/v2/parsing/search/ragDocuments.js";

/**
 * RAG documents search response.
 */
export class RagDocumentSearchResponse extends BaseSearchResponse {
  static readonly slug = "rag-documents";

  /**
   * Paginated list of matching RAG documents.
   */
  public ragDocuments: RagDocuments;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.ragDocuments = new RagDocuments(serverResponse["rag_documents"] ?? []);
  }

  protected bodyLines(): string[] {
    return ["RAG Documents", "################", this.ragDocuments.toString()];
  }
}
