import { BaseParameters } from "@/v2/client/index.js";
import { ResponseConstructor } from "@/v2/parsing/index.js";

/**
 * Base class for all V2 product definitions.
 *
 * Child classes are passed to the Client when making requests.
 */
export abstract class BaseProduct {
  static get parametersClass(): new (...args: any[]) => BaseParameters {
    throw new Error("Must define static parameters property");
  }
  static get responseClass(): ResponseConstructor<any> {
    throw new Error("Must define static response property");
  }
  static get slug(): string {
    throw new Error("Must define static slug property");
  }
}
