import { SplitResponse } from "@/v2/parsing/index.js";
import { SplitParameters } from "@/v2/client/index.js";
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
