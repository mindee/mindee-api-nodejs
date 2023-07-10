import { StringDict } from "../common";
import { Page } from "./page";
import { Prediction } from "./prediction";
import { Product } from "./product";

export abstract class Inference<PageT extends Prediction, DocT extends Prediction> {
  isRotationApplied?: boolean;
  product: Product;
  pages: Array<Page<PageT>> = [];
  prediction?: DocT;

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
${this.pages.map((e: Page<PageT>) => e.toString() || "").join("\n")}`;
  }
}