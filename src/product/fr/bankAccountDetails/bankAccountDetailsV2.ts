import { Inference, StringDict, Page } from "../../../parsing/common";
import { BankAccountDetailsV2Document } from "./bankAccountDetailsV2Document";

/**
 * Inference prediction for Bank Account Details, API version 2.
 */
export class BankAccountDetailsV2 extends Inference {
  /** Endpoint's name */
  endpointName = "bank_account_details";
  /** Endpoint's version */
  endpointVersion = "2";
  /** The document-level prediction */
  prediction: BankAccountDetailsV2Document;
  /** The document's pages */
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
