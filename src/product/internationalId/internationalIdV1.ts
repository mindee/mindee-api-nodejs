import { Inference, StringDict, Page } from "../../parsing/common";
import { InternationalIdV1Document } from "./internationalIdV1Document";

/**
 * Inference prediction for International ID, API version 1.
 */
export class InternationalIdV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "international_id";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: InternationalIdV1Document;
  /** The document's pages. */
  pages: Page<InternationalIdV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new InternationalIdV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            InternationalIdV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
