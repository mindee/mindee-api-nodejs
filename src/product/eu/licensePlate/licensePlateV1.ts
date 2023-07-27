import { Inference, StringDict, Page } from "../../../parsing/common";
import { LicensePlateV1Document } from "./licensePlateV1Document";

export class LicensePlateV1 extends Inference {
  endpointName = "license_plates";
  endpointVersion = "1";
  prediction: LicensePlateV1Document;
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