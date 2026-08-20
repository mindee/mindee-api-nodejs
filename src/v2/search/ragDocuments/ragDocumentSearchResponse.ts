import { StringDict } from "@/parsing/index.js";
import { BaseSearchResponse } from "@/v2/parsing/search/index.js";
import { SearchRagDocuments } from "@/v2/parsing/search/searchRagDocuments.js";

/**
 * RAG documents search response.
 */
export class RagDocumentSearchResponse extends BaseSearchResponse {

  /**
   * Paginated list of matching RAG documents.
   */
  public ragDocuments: SearchRagDocuments;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.ragDocuments = new SearchRagDocuments(serverResponse["rag_documents"] ?? []);
  }

  protected bodyLines(): string[] {
    return ["RAG Documents", "################", this.ragDocuments.toString()];
  }
}
