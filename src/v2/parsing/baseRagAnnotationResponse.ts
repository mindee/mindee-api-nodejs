import { BaseResponse } from "./baseResponse.js";
import { StringDict, parseDate } from "@/parsing/index.js";

/**
 * Base class for all RAG document responses from the V2 API.
 */
export class BaseRagAnnotationResponse extends BaseResponse {
  /**
   * Unique identifier of the RAG document.
   */
  id: string;

  /**
   * Original filename of the uploaded document.
   */
  filename: string;

  /**
   * Date and time of the document creation.
   */
  createdAt: Date;

  /**
   * Current status of the RAG document.
   */
  status: string;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.id = serverResponse["id"];
    this.filename = serverResponse["filename"];
    this.createdAt = parseDate(serverResponse["created_at"])!;
    this.status = serverResponse["status"];
  }
}

/**
 * Constructor signature for typed v2 response classes.
 */
export type AnnotationResponseConstructor<T extends BaseRagAnnotationResponse> = new (serverResponse: StringDict) => T;
