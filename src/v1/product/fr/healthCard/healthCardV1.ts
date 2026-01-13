import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { HealthCardV1Document } from "./healthCardV1Document.js";

/**
 * Health Card API version 1 inference prediction.
 */
export class HealthCardV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "french_healthcard";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: HealthCardV1Document;
  /** The document's pages. */
  pages: Page<HealthCardV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new HealthCardV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            HealthCardV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
