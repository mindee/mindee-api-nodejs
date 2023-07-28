import { Inference, StringDict, Page } from "../../../parsing/common";
import { BankAccountDetailsV1Document } from "./bankAccountDetailsV1Document";

export class BankAccountDetailsV1 extends Inference {
  endpointName = "bank_account_details";
  endpointVersion = "1";
  prediction: BankAccountDetailsV1Document;
  pages: Page<BankAccountDetailsV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new BankAccountDetailsV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          BankAccountDetailsV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
