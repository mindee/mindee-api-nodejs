import { Inference, StringDict, Page } from "../../../parsing/common";
import { BankCheckV1Document } from "./bankCheckV1Document";
import { BankCheckV1Page } from "./bankCheckV1Page";

export class BankCheckV1 extends Inference {
  endpointName = "bank_check";
  endpointVersion = "1";
  prediction: BankCheckV1Document;
  pages: Page<BankCheckV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new BankCheckV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          BankCheckV1Page,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}