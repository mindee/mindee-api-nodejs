import { OcrResponse } from "./ocrResponse.js";
import { OcrParameters } from "./ocrParameters.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

export class Ocr extends BaseProduct {
  static get parameters() {
    return OcrParameters;
  }
  static get response() {
    return OcrResponse;
  }
  static get enqueueSlug() {
    return "utilities/ocr";
  }
  static get getResultSlug() {
    return "utilities/ocr";
  }
}
