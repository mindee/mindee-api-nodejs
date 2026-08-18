import { ResponseConstructor } from "@/v2/parsing/index.js";
import { BaseSearchParameters } from "@/v2/clientOptions/index.js";

/**
 * Base class for all V2 search definitions.
 *
 * Child classes are passed to the Client when making requests.
 */
export abstract class BaseSearch {
  /** Parameter class used for the search query. */
  static get parametersClass(): new (...args: any[]) => BaseSearchParameters {
    throw new Error("Must define static parametersClass property");
  }

  /** Response class returned by the search. */
  static get responseClass(): ResponseConstructor<any> {
    throw new Error("Must define static response property");
  }

  /** API slug for the search. */
  static get slug(): string {
    throw new Error("Must define static slug property");
  }
}
