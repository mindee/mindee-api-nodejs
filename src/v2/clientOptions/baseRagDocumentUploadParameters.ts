/**
 * Base parameters for document upload operations.
 */
export abstract class BaseRagDocumentUploadParameters {
  /**
   * UUID of the model that the uploaded RAG document is linked to.
   */
  public readonly modelId: string;

  /**
   * Default constructor.
   * @param modelId UUID of the model that the uploaded RAG document is linked to.
   */
  protected constructor(modelId: string) {
    if (!modelId || modelId.trim().length === 0) {
      throw new Error("modelId cannot be null or whitespace.");
    }
    this.modelId = modelId.trim();
  }

  /**
   * Gets the request parameters for the upload request.
   */
  public getRequestParameters(): Record<string, string> {
    const parameters: Record<string, string> = {};
    parameters["model_id"] = this.modelId;
    return parameters;
  }
}
