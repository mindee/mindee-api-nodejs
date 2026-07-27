import { StringDict } from "@/parsing/stringDict.js";
import { ClassificationClassifier } from "./classificationClassifier.js";

/** Classification section of a classification inference result. */
export class ClassificationResult {
  /**
   * Fields contained in the inference.
   */
  public classification: ClassificationClassifier;

  constructor(serverResponse: StringDict) {
    this.classification = new ClassificationClassifier(serverResponse["classification"]);
  }

  /** Returns a readable classification summary. */
  toString(): string {
    return `Classification\n==============\n${this.classification}`;
  }
}
