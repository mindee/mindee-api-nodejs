import { Inference, StringDict, Page } from "../../../parsing/common";
import { HealthcareCardV1Document } from "./healthcareCardV1Document";

/**
 * Healthcare Card API version 1 inference prediction.
 */
export class HealthcareCardV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "us_healthcare_cards";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: HealthcareCardV1Document;
  /** The document's pages. */
  pages: Page<HealthcareCardV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new HealthcareCardV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            HealthcareCardV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
