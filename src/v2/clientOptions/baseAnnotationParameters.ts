import { MindeeConfigurationError } from "@/errors/index.js";

/**
 * Constructor parameters for BaseAnnotationParameters and its subclasses.
 */
export interface BaseAnnotationParametersConstructor {
  documentId: string;
}

/**
 * Base parameters for document annotations.
 */
export abstract class BaseAnnotationParameters {
  /**
   * UUID of the annotated document.
   */
  public readonly documentId: string;

  /**
   * Default constructor.
   */
  protected constructor(params: BaseAnnotationParametersConstructor) {
    const documentId = params.documentId?.trim();
    if (!documentId) {
      throw new MindeeConfigurationError("Document ID must be provided");
    }
    // Note: documentId is included in the request URL path, it is not a parameter.
    this.documentId = documentId;
  }

  /**
   * Gets the request parameters for the upload request.
   */
  public abstract getRequestParameters(): Record<string, string>;
}
