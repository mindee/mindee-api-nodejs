import { StringDict } from "@/parsing/stringDict.js";
import { ClassificationClassifier } from "./classificationClassifier.js";

export class ClassificationResult {
  /**
   * Fields contained in the inference.
   */
  public classification: ClassificationClassifier;

  constructor(serverResponse: StringDict) {
    this.classification = new ClassificationClassifier(serverResponse["classification"]);
  }

  toString(): string {
    return `Classification\n==============\n${this.classification}`;
  }
}
