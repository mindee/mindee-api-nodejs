import { BaseAnnotationParameters } from "@/v2/clientOptions/baseAnnotationParameters.js";
import { RagAnnotation } from "@/v2/product/extraction/ragDocuments/ragAnnotation.js";

/**
 * Annotation parameters for RAG documents.
 */
export class RagDocumentAnnotationParameters extends BaseAnnotationParameters {
  /**
   * New public status to apply to the document (for example, to deactivate it).
   */
  public readonly status?: string;

  /**
   * Field-level RAG annotation and guidelines configuration for the document.
   */
  public readonly annotation?: RagAnnotation | null;

  /**
   * Default constructor.
   * @param documentId UUID of the annotated document.
   * @param status New public status to apply to the document.
   * @param annotation Field-level RAG annotation and guidelines configuration.
   */
  constructor(
    documentId: string,
    status?: string,
    annotation?: RagAnnotation | string | Record<string, any> | null
  ) {
    super(documentId);

    this.status = status;

    if (annotation === null || annotation === undefined) {
      this.annotation = null;
    } else if (annotation instanceof RagAnnotation) {
      this.annotation = annotation;
    } else if (typeof annotation === "string") {
      const parsedJson = JSON.parse(annotation);
      this.annotation = new RagAnnotation(parsedJson);
    } else if (typeof annotation === "object" && !Array.isArray(annotation)) {
      this.annotation = new RagAnnotation(annotation);
    } else {
      throw new Error("Invalid RAG Annotation format.");
    }
  }

  /**
   * Gets the request parameters for the upload request.
   */
  public getRequestParameters(): Record<string, any> {
    const parameters: Record<string, any> = {};

    if (this.status) {
      parameters["status"] = this.status;
    }

    if (this.annotation) {
      parameters["annotation"] = this.annotation;
    }

    return parameters;
  }
}
