import { ExtractionResponse } from "./extractionResponse.js";
import { ExtractionParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Automatically extract structured data from any image or scanned document.
 */
export class Extraction extends BaseProduct {
  /** @inheritDoc */
  static get parametersClass() {
    return ExtractionParameters;
  }

  /** @inheritDoc */
  static get responseClass() {
    return ExtractionResponse;
  }

  /** @inheritDoc */
  static get slug() {
    return "extraction";
  }
}
