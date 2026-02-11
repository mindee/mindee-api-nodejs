import { CropResponse } from "./cropResponse.js";
import { CropParameters } from "./cropParameters.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

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
