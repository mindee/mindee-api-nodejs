import { Inference, StringDict, Page } from "../../../parsing/common";
import { CarteVitaleV1Document } from "./carteVitaleV1Document";

export class CarteVitaleV1 extends Inference {
  endpointName = "carte_vitale";
  endpointVersion = "1";
  prediction: CarteVitaleV1Document;
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
