import { Prediction } from "./prediction";

export class Extras extends Array<Prediction>{
  toString(): string {
    return this.map((prediction: Prediction) => prediction.toString()).join("\n") + "\n";
  }
}