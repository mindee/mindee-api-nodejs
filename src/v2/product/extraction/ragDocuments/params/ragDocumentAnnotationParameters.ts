import { BaseAnnotationParameters } from "@/v2/clientOptions/baseAnnotationParameters.js";
import { RagAnnotation } from "@/v2/product/extraction/ragDocuments/ragAnnotation.js";
import { BaseAnnotationParametersConstructor } from "@/v2/clientOptions/baseAnnotationParameters.js";

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
   */
  constructor(
    params: BaseAnnotationParametersConstructor &
      {
        status?: string,
        annotation?: RagAnnotation | string | Record<string, any> | null
      }
  ) {
    super({ ...params });

    this.status = params.status;

    if (params.annotation === null || params.annotation === undefined) {
      this.annotation = null;
    } else if (params.annotation instanceof RagAnnotation) {
      this.annotation = params.annotation;
    } else if (typeof params.annotation === "string") {
      const parsedJson = JSON.parse(params.annotation);
      this.annotation = new RagAnnotation(parsedJson);
    } else if (typeof params.annotation === "object" && !Array.isArray(params.annotation)) {
      this.annotation = new RagAnnotation(params.annotation);
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
