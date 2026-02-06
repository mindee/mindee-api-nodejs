import { OcrResponse } from "@/v2/parsing/index.js";
import { OcrParameters } from "@/v2/client/index.js";
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
