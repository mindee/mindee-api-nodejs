import { Inference, StringDict, Page } from "../../../parsing/common";
import { CarteVitaleV1Document } from "./carteVitaleV1Document";

/**
 * Inference prediction for Carte Vitale, API version 1.
 */
export class CarteVitaleV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "carte_vitale";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: CarteVitaleV1Document;
  /** The document's pages. */
  pages: Page<CarteVitaleV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new CarteVitaleV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            CarteVitaleV1Document,
            page,
            page["id"],
            page["orientation"]
          ))
        }
      }
    );
  }
}
