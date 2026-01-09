import { StringDict } from "@/parsing/stringDict.js";
import { MvisionV1 } from "./mvisionV1.js";

export class Ocr {
  /** Default Mindee OCR */
  mVisionV1: MvisionV1;

  constructor(rawPrediction: StringDict) {
    this.mVisionV1 = new MvisionV1(rawPrediction["mvision-v1"]);
  }

  /**
   * Default string representation.
   */
  toString() {
    return this.mVisionV1.toString();
  }
}
