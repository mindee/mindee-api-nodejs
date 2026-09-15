import { BaseRagAnnotationResponse } from "@/v2/parsing/baseRagAnnotationResponse.js";
import { RagAnnotation } from "./ragAnnotation.js";
import { parseDate, StringDict } from "@/parsing/index.js";

/**
 * Response for a RAG document.
 */
export class ExtractionRagAnnotationResponse extends BaseRagAnnotationResponse {
  /**
   * Model identifier linked to the RAG document.
   */
  public modelId: string;

  /**
   * Number of times this document was used in an inference.
   */
  public totalMatches: number;

  /**
   * Date and time of the latest matching inference, if any.
   */
  public lastMatchAt: Date | null;

  /**
   * Annotation metadata associated with the document.
   */
  public annotation: RagAnnotation | null;

  constructor(serverResponse: StringDict) {
    super(serverResponse);

    this.modelId = serverResponse["model_id"];
    this.totalMatches = serverResponse["total_matches"];
    this.lastMatchAt = parseDate(serverResponse["last_match_at"]);
    this.annotation = serverResponse["annotation"]
      ? new RagAnnotation(serverResponse["annotation"])
      : null;
  }
}
