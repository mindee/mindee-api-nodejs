import { Inference, StringDict, Page } from "../../../parsing/common";
import { LicensePlateV1Document } from "./licensePlateV1Document";

/**
 * License Plate API version 1 inference prediction.
 */
export class LicensePlateV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "license_plates";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: LicensePlateV1Document;
  /** The document's pages. */
  pages: Page<LicensePlateV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new LicensePlateV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            LicensePlateV1Document,
            page,
            page["id"],
            page["orientation"]
          ))
        }
      }
    );
  }
}
