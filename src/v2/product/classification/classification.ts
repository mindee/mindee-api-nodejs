import { ClassificationResponse } from "./classificationResponse.js";
import { ClassificationParameters } from "./classificationParameters.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

export class Classification extends BaseProduct {
  static get parameters() {
    return ClassificationParameters;
  }
  static get response() {
    return ClassificationResponse;
  }
  static get enqueueSlug() {
    return "utilities/classification";
  }
  static get getResultSlug() {
    return "utilities/classification";
  }
}
