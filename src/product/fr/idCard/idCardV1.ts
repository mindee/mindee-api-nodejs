import { Inference, StringDict, Page } from "../../../parsing/common";
import { IdCardV1Document } from "./idCardV1Document";
import { IdCardV1Page } from "./idCardV1Page";

/**
 * Inference prediction for Carte Nationale d'Identité, API version 1.
 */
export class IdCardV1 extends Inference {
  /** Endpoint's name */
  endpointName = "idcard_fr";
  /** Endpoint's version */
  endpointVersion = "1";
  /** The document-level prediction */
  prediction: IdCardV1Document;
  /** The document's pages */
  pages: Page<IdCardV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new IdCardV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          IdCardV1Page,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
