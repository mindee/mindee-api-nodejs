import { MindeeConfigurationError } from "@/errors/index.js";

/**
 * Constructor parameters for BaseRagDocumentUploadParameters and its subclasses.
 */
export interface BaseRagDocumentUploadParametersConstructor {
  modelId: string;
}

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
   */
  protected constructor(params: BaseRagDocumentUploadParametersConstructor) {
    const modelId = params.modelId?.trim();
    if (!modelId) {
      throw new MindeeConfigurationError("Model ID must be provided");
    }
    this.modelId = modelId;
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
