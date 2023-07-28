import { Inference, StringDict, Page } from "../../../parsing/common";
import { BankAccountDetailsV2Document } from "./bankAccountDetailsV2Document";

export class BankAccountDetailsV2 extends Inference {
  endpointName = "bank_account_details";
  endpointVersion = "2";
  prediction: BankAccountDetailsV2Document;
  pages: Page<BankAccountDetailsV2Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new BankAccountDetailsV2Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          BankAccountDetailsV2Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}