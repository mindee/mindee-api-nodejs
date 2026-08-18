import { ClassificationResponse } from "./classificationResponse.js";
import { ClassificationParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Automatically sort any image or scanned document into categories.
 */
export class Classification extends BaseProduct {
  /** @inheritDoc */
  static get parametersClass() {
    return ClassificationParameters;
  }

  /** @inheritDoc */
  static get responseClass() {
    return ClassificationResponse;
  }

  /** @inheritDoc */
  static get slug() {
    return "classification";
  }
}
