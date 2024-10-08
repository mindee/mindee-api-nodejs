import { Inference, StringDict, Page } from "../../../parsing/common";
import { IdCardV2Document } from "./idCardV2Document";
import { IdCardV2Page } from "./idCardV2Page";

/**
 * Carte Nationale d'Identité API version 2 inference prediction.
 */
export class IdCardV2 extends Inference {
  /** The endpoint's name. */
  endpointName = "idcard_fr";
  /** The endpoint's version. */
  endpointVersion = "2";
  /** The document-level prediction. */
  prediction: IdCardV2Document;
  /** The document's pages. */
  pages: Page<IdCardV2Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new IdCardV2Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            IdCardV2Page,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
