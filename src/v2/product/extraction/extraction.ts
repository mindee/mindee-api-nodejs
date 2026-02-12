import { ExtractionResponse } from "./extractionResponse.js";
import { ExtractionParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

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
