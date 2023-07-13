import { StringDict } from "../common";
import { Page } from "./page";
import type { Prediction } from "./prediction";
import { Product } from "./product";

export class Inference {
  isRotationApplied?: boolean;
  product: Product;
  pages: Array<Page<Prediction>> = [];
  prediction?: Prediction;
  endpointName?:string;
  endpointVersion?:string;

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