import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { IdCardV1Document } from "./idCardV1Document.js";
import { IdCardV1Page } from "./idCardV1Page.js";

/**
 * Carte Nationale d'Identité API version 1 inference prediction.
 */
export class IdCardV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "idcard_fr";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: IdCardV1Document;
  /** The document's pages. */
  pages: Page<IdCardV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new IdCardV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            IdCardV1Page,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
