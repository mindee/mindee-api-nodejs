import { Inference, StringDict, Page } from "../../parsing/common";
import { PassportV1Document } from "./passportV1Document";

/**
 * Passport API version 1 inference prediction.
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
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            PassportV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
