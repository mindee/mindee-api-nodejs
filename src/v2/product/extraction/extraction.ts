import { ExtractionResponse } from "./extractionResponse.js";
import { ExtractionParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Automatically extract structured data from any image or scanned document.
 */
export class Extraction extends BaseProduct {
  /** Parameter class accepted by this product. */
  static get parametersClass() {
    return ExtractionParameters;
  }
  /** Response class returned by this product. */
  static get responseClass() {
    return ExtractionResponse;
  }
  /** API slug for this product. */
  static get slug() {
    return "extraction";
  }
}
