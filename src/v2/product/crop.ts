import { CropResponse } from "@/v2/parsing/index.js";
import { CropParameters } from "@/v2/client/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

export class Crop extends BaseProduct {
  static get parameters() {
    return CropParameters;
  }
  static get response() {
    return CropResponse;
  }
  static get enqueueSlug() {
    return "utilities/crop";
  }
  static get getResultSlug() {
    return "utilities/crop";
  }
}
