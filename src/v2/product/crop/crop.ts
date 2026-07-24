import { CropResponse } from "./cropResponse.js";
import { CropParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Identify the borders of documents on each page, matching each one to a category.
 */
export class Crop extends BaseProduct {
  /** Parameter class accepted by this product. */
  static get parametersClass() {
    return CropParameters;
  }
  /** Response class returned by this product. */
  static get responseClass() {
    return CropResponse;
  }
  /** API slug for this product. */
  static get slug() {
    return "crop";
  }
}
