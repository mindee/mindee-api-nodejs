import { StringDict } from "../common";
import { Page } from "./page";
import type { Prediction } from "./prediction";
import { Product } from "./product";

export class Inference {
  isRotationApplied?: boolean;
  product: Product;
  pages: Array<Page<Prediction>> = [];
  prediction?: Prediction;
  endpointName?: string;
  endpointVersion?: string;

  constructor(
    rawPrediction: StringDict,
  ) {
    this.isRotationApplied = rawPrediction["is_rotation_applied"] ?? undefined;
    this.product = rawPrediction["product"];
  };

  toString() {
    return `Inference
#########
:Product: ${this.product.name} v${this.product.version}
:Rotation applied: ${this.isRotationApplied ? "Yes" : "No"}

Prediction
==========
${this.prediction?.toString() || ""}

Page Predictions
================
${this.pages.map((e: Page<Prediction>) => e.toString() || "").join("\n")}`;
  }

  static cleanOutString(outStr: string): string {
    const lines = / \n/gm;
    return outStr.replace(lines, "\n");
  }
}


export class InferenceFactory{
  /**
   * Builds a blank product of the given type & sends back the endpointName & endpointVersion parameters of OTS classes.
   * Note: the need for this boils down to the fact that we want to keep a simple & homogeneous Client.parse() syntax
   * across all SDKs, and since Typescript can't access dynamically-created class static variables, we have to use an instance as a shortcut.
   * @param inferenceClass Class of the product we are using
   * @returns {Inference} An empty instance of a given product.
   */
  public static getEndpoint<T extends Inference>(inferenceClass: new (httpResponse: StringDict) => T): [string, string] {
    if (inferenceClass.name === "CustomV1"){
      throw new Error(`Cannot process custom endpoint as OTS API endpoints. Please provide an endpoint name & version manually.`);
    }
    const emptyProduct = new inferenceClass({
      "document": {
        "inference": {
          "prediction": {}
        }
      },
      "is_rotation_applied": null,
      "product":
      {
        "name": "N/A",
        "version": "N/A"
      }
    }) as T;
    if (!emptyProduct.endpointName || !emptyProduct.endpointVersion || emptyProduct.endpointName.length === 0 || emptyProduct.endpointVersion.length === 0) {
      throw new Error(`Error during endpoint verification, no endpoint found for product ${inferenceClass.name}.`);
    }
    return [emptyProduct.endpointName, emptyProduct.endpointVersion];
  }
}