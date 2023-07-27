import { Inference, StringDict, Page } from "../../../parsing/common";
import { IdCardV1Document } from "./idCardV1Document";
import { IdCardV1Page } from "./idCardV1Page";

export class IdCardV1 extends Inference {
  endpointName = "idcard_fr";
  endpointVersion = "1";
  prediction: IdCardV1Document;
  pages: Page<IdCardV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new IdCardV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(IdCardV1Page, page, page["id"], page["orientation"])
    );
  }
}
