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
   * @param documentId The UUID of the document.
   */
  protected constructor(documentId: string) {
    if (!documentId || documentId.trim().length === 0) {
      throw new Error("documentId cannot be null or whitespace.");
    }

    // Note: DocumentId is included in the request URL path, it is not a parameter.
    this.documentId = documentId.trim();
  }

  /**
   * Gets the request parameters for the upload request.
   */
  public abstract getRequestParameters(): Record<string, string>;
}
