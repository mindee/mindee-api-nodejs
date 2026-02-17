import { SplitResponse } from "./splitResponse.js";
import { SplitParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Break a multipage source file into separate documents, associating a class for each one.
 */
export class Split extends BaseProduct {
  static get parametersClass() {
    return SplitParameters;
  }
  static get responseClass() {
    return SplitResponse;
  }
  static get slug() {
    return "split";
  }
}
