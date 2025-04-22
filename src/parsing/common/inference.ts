import { StringDict } from "../common";
import { ExtraField, Extras } from "./extras/extras";
import { Page } from "./page";
import type { Prediction } from "./prediction";
import { Product } from "./product";
import { CropperExtra, FullTextOcrExtra } from "./extras";
import { RAGExtra } from "./extras/ragExtra";

/**
 *
 * @typeParam DocT an extension of a `Prediction`. Is generic by default to
 * allow for easier optional `PageT` generic typing.
 * @typeParam PageT an extension of a `DocT` (`Prediction`). Should only be set
 * if a document's pages have specific implementation.
 */
export abstract class Inference<
  DocT extends Prediction = Prediction,
  PageT extends DocT = DocT
> {
  /** A boolean denoting whether a given inference result was rotated. */
  isRotationApplied?: boolean;
  /** Name and version of a given product. */
  product: Product;
  /** Wrapper for a document's pages prediction. */
  pages: Page<PageT>[] = [];
  /** A document's top-level `Prediction`. */
  prediction!: DocT;
  /** Extraneous fields relating to specific tools for some APIs. */
  extras?: Extras;
  /** Name of a document's endpoint. Has a default value for OTS APIs. */
  endpointName?: string;
  /** A document's version. Has a default value for OTS APIs. */
  endpointVersion?: string;

  constructor(rawPrediction: StringDict) {
    this.isRotationApplied = rawPrediction?.is_rotation_applied ?? undefined;
    this.product = rawPrediction?.product;

    if (
      rawPrediction["extras"] &&
      Object.keys(rawPrediction["extras"].length > 0)
    ) {
      const extras: Record<string, ExtraField> = {};
      Object.entries(rawPrediction["extras"]).forEach(
        ([extraKey, extraValue]: [string, any]) => {
          switch (extraKey) {
          case "cropper":
            extras.cropper = new CropperExtra(extraValue as StringDict);
            break;
          case "full_text_ocr":
            extras.fullTextOcr = new FullTextOcrExtra(extraValue as StringDict);
            break;
          case "rag":
            extras.rag = new RAGExtra(extraValue as StringDict);
            break;
          }
        }
      );
      this.extras = extras;
    }
  }

  /**
   * Default string representation.
   */
  toString() {

    let pages = "";
    if (this.pages.toString().length > 0) {
      pages = `
Page Predictions
================

${this.pages.map((e: Page<PageT>) => e.toString() || "").join("\n")}`;
    }
    return `Inference
#########
:Product: ${this.product.name} v${this.product.version}
:Rotation applied: ${this.isRotationApplied ? "Yes" : "No"}

Prediction
==========
${this.prediction.toString().length === 0 ? "" : this.prediction.toString() + "\n"}${pages}`;
  }

  /**
   * Takes in an input string and replaces line breaks with `\n`.
   * @param outStr string to cleanup
   * @returns cleaned out string
   */
  static cleanOutString(outStr: string): string {
    const lines = / \n/gm;
    return outStr.replace(lines, "\n");
  }
}

/**
 * Factory to allow for static-like property access syntax in TypeScript.
 * Used to retrieve endpoint data for standard products.
 */
export class InferenceFactory {
  /**
   * Builds a blank product of the given type & sends back the endpointName & endpointVersion parameters of OTS classes.
   * Note: this is needed to avoid passing anything other than the class of the object to the parse()/enqueue() call.
   * @param inferenceClass Class of the product we are using
   * @returns {Inference} An empty instance of a given product.
   */
  public static getEndpoint<T extends Inference>(
    inferenceClass: new (httpResponse: StringDict) => T
  ): [string, string] {
    if (inferenceClass.name === "CustomV1") {
      throw new Error(
        "Cannot process custom endpoint as OTS API endpoints. Please provide an endpoint name & version manually."
      );
    }
    const emptyProduct = new inferenceClass({
      prediction: {},
      pages: [],
    }) as T;
    if (
      !emptyProduct.endpointName ||
      !emptyProduct.endpointVersion ||
      emptyProduct.endpointName.length === 0 ||
      emptyProduct.endpointVersion.length === 0
    ) {
      throw new Error(
        `Error during endpoint verification, no endpoint found for product ${inferenceClass.name}.`
      );
    }
    return [emptyProduct.endpointName, emptyProduct.endpointVersion];
  }
}
