import { OcrResponse } from "./ocrResponse.js";
import { OcrParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Extract raw text (OCR) from any image or scanned document.
 */
export class Ocr extends BaseProduct {
  /** Parameter class accepted by this product. */
  static get parametersClass() {
    return OcrParameters;
  }
  /** Response class returned by this product. */
  static get responseClass() {
    return OcrResponse;
  }
  /** API slug for this product. */
  static get slug() {
    return "ocr";
  }
}
