import { Inference, StringDict, Page } from "../../../parsing/common";
import { CarteVitaleV1Document } from "./carteVitaleV1Document";

/**
 * Inference prediction for Carte Vitale, API version 1.
 */
export class CarteVitaleV1 extends Inference {
  /** Endpoint's name */
  endpointName = "carte_vitale";
  /** Endpoint's version */
  endpointVersion = "1";
  /** The document-level prediction */
  prediction: CarteVitaleV1Document;
  /** The document's pages */
  pages: Page<CarteVitaleV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new CarteVitaleV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          CarteVitaleV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
