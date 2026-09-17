import { BaseRagDocumentUploadParameters, BaseRagDocumentUploadParametersConstructor
} from "@/v2/clientOptions/baseRagDocumentUploadParameters.js";

/**
 * Parameters for uploading a file to an extraction RAG database.
 */
export class RagDocumentUploadParameters extends BaseRagDocumentUploadParameters {
  constructor(params: BaseRagDocumentUploadParametersConstructor & {}) {
    super({ ...params });
  }
}
