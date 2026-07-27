import { ClassificationResponse } from "./classificationResponse.js";
import { ClassificationParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Automatically sort any image or scanned document into categories.
 */
export class Classification extends BaseProduct {
  /** Parameter class accepted by this product. */
  static get parametersClass() {
    return ClassificationParameters;
  }
  /** Response class returned by this product. */
  static get responseClass() {
    return ClassificationResponse;
  }
  /** API slug for this product. */
  static get slug() {
    return "classification";
  }
}
