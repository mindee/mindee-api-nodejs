import { ExtractionResponse } from "@/v2/parsing/index.js";
import { ExtractionParameters } from "@/v2/client/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

export class Extraction extends BaseProduct {
  static get parameters() {
    return ExtractionParameters;
  }
  static get response() {
    return ExtractionResponse;
  }
  static get enqueueSlug() {
    return "inferences";
  }
  static get getResultSlug() {
    return "inferences";
  }
}
