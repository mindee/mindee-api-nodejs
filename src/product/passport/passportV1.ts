import { Inference, StringDict, Page } from "../../parsing/common";
import { PassportV1Document } from "./passportV1Document";

export class PassportV1 extends Inference {
  endpointName = "passport";
  endpointVersion = "1";
  prediction: PassportV1Document;
  pages: Page<PassportV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new PassportV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          PassportV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}