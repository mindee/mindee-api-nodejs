import { Inference, StringDict, Page } from "../../parsing/common";
import { PassportV1Document } from "./passportV1Document";

/**
 * Inference prediction for Passport, API version 1.
 */
export class PassportV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "passport";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: PassportV1Document;
  /** The document's pages. */
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
