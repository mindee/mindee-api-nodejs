import { MindeeConfigurationError } from "@/errors/index.js";
import { BaseSearchParameters, BaseSearchParametersConstructor } from "@/v2/clientOptions/baseSearchParameters.js";

/**
 * Constructor parameters for RagDocumentSearchParameters.
 */
export interface RagDocumentSearchParametersConstructor extends BaseSearchParametersConstructor {
  modelId?: string;
  filename?: string;
}

/**
 * Search parameters for RAG Documents.
 */
export class RagDocumentSearchParameters extends BaseSearchParameters {
  /**
   * Model identifier to search in.
   */
  modelId?: string;

  /**
   * Case-insensitive substring search on filename.
   */
  filename?: string;

  constructor(params: RagDocumentSearchParametersConstructor = {}) {
    super(params);
    this.modelId = params.modelId;
    this.filename = params.filename;
  }

  /** @inheritdoc */
  getRequestParameters(): Record<string, string> {
    const parameters = super.getRequestParameters();
    if (this.modelId) {
      parameters["model_id"] = this.modelId;
    } else {
      throw new MindeeConfigurationError("ModelId is required in RagDocumentSearchParameters");
    }
    if (this.filename) {
      parameters["filename"] = this.filename;
    }
    return parameters;
  }
}
