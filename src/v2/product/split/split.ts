import { SplitResponse } from "./splitResponse.js";
import { SplitParameters } from "./params/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Break a multipage source file into separate documents, associating a class for each one.
 */
export class Split extends BaseProduct {
  /** Parameter class accepted by this product. */
  static get parametersClass() {
    return SplitParameters;
  }
  /** Response class returned by this product. */
  static get responseClass() {
    return SplitResponse;
  }
  /** API slug for this product. */
  static get slug() {
    return "split";
  }
}
