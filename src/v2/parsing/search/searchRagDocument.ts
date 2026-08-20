import { StringDict } from "@/parsing/index.js";

/**
 * Individual RAG document information.
 */
export class SearchRagDocument {
  /**
   * Unique identifier of the RAG document.
   */
  public id: string;

  /**
   * Model identifier linked to the RAG document.
   */
  public modelId: string;

  /**
   * Original filename of the uploaded document.
   */
  public filename: string;

  /**
   * Date and time of the document creation.
   */
  public createdAt: Date;

  /**
   * Number of times this document was used in an inference.
   */
  public totalMatches: number;

  /**
   * Date and time of the latest matching inference, if any.
   */
  public lastMatchAt?: Date;

  /**
   * Current status of the RAG document.
   */
  public status: string;

  constructor(serverResponse: StringDict) {
    this.id = serverResponse["id"];
    this.modelId = serverResponse["model_id"];
    this.filename = serverResponse["filename"];
    this.createdAt = new Date(serverResponse["created_at"]);
    this.totalMatches = serverResponse["total_matches"];
    this.lastMatchAt = serverResponse["last_match_at"]
      ? new Date(serverResponse["last_match_at"])
      : undefined;
    this.status = serverResponse["status"];
  }
}
