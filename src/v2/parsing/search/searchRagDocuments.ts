import { SearchRagDocument } from "@/v2/parsing/search/searchRagDocument.js";
import { StringDict } from "@/parsing/index.js";

/**
 * List of RAG documents.
 */
export class SearchRagDocuments extends Array<SearchRagDocument> {

  constructor(serverResponse: StringDict[] = []) {
    super();
    this.push(...serverResponse.map((item: StringDict) => new SearchRagDocument(item)));
  }

  toString(): string {
    if (this.length === 0) {
      return "\n";
    }
    const lines: string[] = [];
    for (const ragDocument of this) {
      lines.push(`* :ID: ${ragDocument.id}`);
      lines.push(`  :Model ID: ${ragDocument.modelId}`);
      lines.push(`  :Filename: ${ragDocument.filename}`);
      lines.push(`  :Created At: ${ragDocument.createdAt}`);
      lines.push(`  :Total Matches: ${ragDocument.totalMatches}`);
      lines.push(`  :Last Match At: ${ragDocument.lastMatchAt}`);
      lines.push(`  :Status: ${ragDocument.status}`);
    }
    return lines.join("\n");
  }
}
