import { Inference, Page, StringDict } from "../../parsing/common";
import { CustomV1Document } from "./customV1Document";
import { CustomV1Page } from "./customV1Page";

export class CustomV1 extends Inference {
  endpointName = "custom";
  endpointVersion = "1";
  prediction: CustomV1Document;
  pages: Page<CustomV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new CustomV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(CustomV1Page, page, page["id"], page["orientation"])
    );
  }
}
