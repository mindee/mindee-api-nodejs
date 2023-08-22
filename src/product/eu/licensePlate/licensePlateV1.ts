import { Inference, StringDict, Page } from "../../../parsing/common";
import { LicensePlateV1Document } from "./licensePlateV1Document";

/**
 * Inference prediction for License Plate, API version 1.
 */
export class LicensePlateV1 extends Inference {
  /** Endpoint's name */
  endpointName = "license_plates";
  /** Endpoint's version */
  endpointVersion = "1";
  /** The document-level prediction */
  prediction: LicensePlateV1Document;
  /** The document's pages */
  pages: Page<LicensePlateV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new LicensePlateV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          LicensePlateV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
