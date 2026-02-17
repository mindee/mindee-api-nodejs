import { CropResponse } from "./cropResponse.js";
import { CropParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Identify the borders of documents on each page, matching each one to a category.
 */
export class Crop extends BaseProduct {
  static get parametersClass() {
    return CropParameters;
  }
  static get responseClass() {
    return CropResponse;
  }
  static get slug() {
    return "crop";
  }
}
