import { BaseRagDocumentUploadParameters } from "@/v2/clientOptions/baseRagDocumentUploadParameters.js";

export class RagDocumentUploadParameters extends BaseRagDocumentUploadParameters {

  /**
   * Default constructor.
   * @param modelId UUID of the model that the uploaded RAG document is linked to.
   */
  constructor(modelId: string) {
    super(modelId);
  }
}
