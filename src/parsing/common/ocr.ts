import { StringDict } from "./stringDict";
import { MvisionV1 } from "./mvisionV1";

export class Ocr {
  /** Default Mindee OCR */
  mVisionV1: MvisionV1;

  constructor(rawPrediction: StringDict) {
    this.mVisionV1 = new MvisionV1(rawPrediction["mvision-v1"]);
  }

  toString() {
    return this.mVisionV1.toString();
  }
}
