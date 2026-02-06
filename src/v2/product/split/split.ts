import { SplitResponse } from "./splitResponse.js";
import { SplitParameters } from "./splitParameters.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

export class Split extends BaseProduct {
  static get parameters() {
    return SplitParameters;
  }
  static get response() {
    return SplitResponse;
  }
  static get enqueueSlug() {
    return "utilities/split";
  }
  static get getResultSlug() {
    return "utilities/split";
  }
}
