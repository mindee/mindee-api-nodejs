import { BaseProductParameters } from "@/v2/index.js";
import { ResponseConstructor } from "@/v2/parsing/index.js";

/**
 * Base class for all V2 product definitions.
 *
 * Child classes are passed to the Client when making requests.
 */
export abstract class BaseProduct {
  /** Parameter class accepted by this product. */
  static get parametersClass(): new (...args: any[]) => BaseProductParameters {
    throw new Error("Must define static parameters property");
  }

  /** Response class returned by this product. */
  static get responseClass(): ResponseConstructor<any> {
    throw new Error("Must define static response property");
  }

  /** API slug for this product. */
  static get slug(): string {
    throw new Error("Must define static slug property");
  }
}
