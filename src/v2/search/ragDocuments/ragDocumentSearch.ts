import { BaseSearch } from "@/v2/search/baseSearch.js";
import { RagDocumentSearchParameters } from "@/v2/search/index.js";
import { RagDocumentSearchResponse } from "@/v2/search/ragDocuments/ragDocumentSearchResponse.js";

/**
 * Search for RAG Documents.
 */
export class RagDocumentSearch extends BaseSearch {
  /** @inheritDoc */
  static get parametersClass() {
    return RagDocumentSearchParameters;
  }

  /** @inheritDoc */
  static get responseClass() {
    return RagDocumentSearchResponse;
  }

  /** @inheritDoc */
  static get slug() {
    return "rag-documents";
  }
}
