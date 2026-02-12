import { OcrResponse } from "./ocrResponse.js";
import { OcrParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

export class Ocr extends BaseProduct {
  static get parametersClass() {
    return OcrParameters;
  }
  static get responseClass() {
    return OcrResponse;
  }
  static get slug() {
    return "ocr";
  }
}
