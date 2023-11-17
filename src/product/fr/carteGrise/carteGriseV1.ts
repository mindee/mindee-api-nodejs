import { Inference, StringDict, Page } from "../../../parsing/common";
import { CarteGriseV1Document } from "./carteGriseV1Document";

/**
 * Inference prediction for Carte Grise, API version 1.
 */
export class CarteGriseV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "carte_grise";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: CarteGriseV1Document;
  /** The document's pages. */
  pages: Page<CarteGriseV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new CarteGriseV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          CarteGriseV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
