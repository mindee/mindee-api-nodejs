import { Inference, StringDict, Page } from "../../../parsing/common";
import { IdCardV2Document } from "./idCardV2Document";
import { IdCardV2Page } from "./idCardV2Page";

/**
 * Inference prediction for Carte Nationale d'Identité, API version 2.
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
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          IdCardV2Page,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
