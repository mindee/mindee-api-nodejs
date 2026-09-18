import { ExtractionResponse } from "./extractionResponse.js";
import { ExtractionParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";
import {
  ExtractionRagAnnotationResponse
} from "./ragDocuments/index.js";
import { RagDocumentAnnotationParameters, RagDocumentUploadParameters } from "./ragDocuments/params/index.js";

/**
 * Automatically extract structured data from any image or scanned document.
 */
export class Extraction extends BaseProduct {
  /**
   * @inheritDoc
   */
  static get slug() {
    return "extraction";
  }

  /**
   * @inheritDoc
   */
  static get parametersClass() {
    return ExtractionParameters;
  }

  /**
   * @inheritDoc
   */
  static get responseClass() {
    return ExtractionResponse;
  }

  /**
   * @inheritDoc
   */
  static get annotationResponseClass() {
    return ExtractionRagAnnotationResponse;
  }

  /**
   * @inheritDoc
   */
  static get annotationParametersClass() {
    return RagDocumentAnnotationParameters;
  }

  /**
   * @inheritDoc
   */
  static get ragDocumentUploadClass() {
    return RagDocumentUploadParameters;
  }
}
