import { BaseProductParameters } from "@/v2/index.js";
import {
  ResponseConstructor, AnnotationResponseConstructor
} from "@/v2/parsing/index.js";
import { BaseAnnotationParameters } from "@/v2/clientOptions/index.js";
import { BaseRagDocumentUploadParameters } from "@/v2/clientOptions/index.js";

/**
 * Base class for all V2 product definitions.
 *
 * Child classes are passed to the Client when making requests.
 */
export abstract class BaseProduct {
  /**
   * API slug for this product.
   */
  static get slug(): string {
    throw new Error("Must define static slug property");
  }

  /**
   * Parameter class accepted by this product.
   */
  static get parametersClass(): new (...args: any[]) => BaseProductParameters {
    throw new Error("Must define static parametersClass property");
  }

  /**
   * Response class returned by this product.
   */
  static get responseClass(): ResponseConstructor<any> {
    throw new Error("Must define static responseClass property");
  }

  /**
   * Annotation Response class returned by this product.
   */
  static get annotationResponseClass(): AnnotationResponseConstructor<any> {
    throw new Error("Must define static annotationResponseClass property");
  }

  /**
   * Annotation Parameters class for this product.
   */
  static get annotationParametersClass(): new (...args: any[]) => BaseAnnotationParameters {
    throw new Error("Must define static annotationParametersClass property");
  }

  /**
   * Document Upload class for this product.
   */
  static get ragDocumentUploadClass(): new (...args: any[]) => BaseRagDocumentUploadParameters {
    throw new Error("Must define static ragDocumentUploadClass property");
  }
}
