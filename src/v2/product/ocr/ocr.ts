import { OcrResponse } from "./ocrResponse.js";
import { OcrParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Extract raw text (OCR) from any image or scanned document.
 */
export class Ocr extends BaseProduct {
  /** @inheritDoc */
  static get parametersClass() {
    return OcrParameters;
  }

  /** @inheritDoc */
  static get responseClass() {
    return OcrResponse;
  }

  /** @inheritDoc */
  static get slug() {
    return "ocr";
  }
}
