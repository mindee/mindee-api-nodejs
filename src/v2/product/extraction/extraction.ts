import { ExtractionResponse } from "./extractionResponse.js";
import { ExtractionParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Automatically extract structured data from any image or scanned document.
 */
export class Extraction extends BaseProduct {
  static get parametersClass() {
    return ExtractionParameters;
  }
  static get responseClass() {
    return ExtractionResponse;
  }
  static get slug() {
    return "extraction";
  }
}
