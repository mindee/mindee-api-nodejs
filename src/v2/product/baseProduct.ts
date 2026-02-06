import { BaseParameters } from "@/v2/client/index.js";
import { ResponseConstructor } from "@/v2/parsing/index.js";

export abstract class BaseProduct {
  static get parameters(): new (...args: any[]) => BaseParameters {
    throw new Error("Must define static parameters property");
  }
  static get response(): ResponseConstructor<any> {
    throw new Error("Must define static response property");
  }

  static get enqueueSlug(): string {
    throw new Error("Must define static enqueueSlug property");
  }

  static get getResultSlug(): string {
    throw new Error("Must define static getResultSlug property");
  }
}
