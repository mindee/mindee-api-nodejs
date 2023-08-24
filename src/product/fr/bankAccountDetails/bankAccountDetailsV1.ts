import { Inference, StringDict, Page } from "../../../parsing/common";
import { BankAccountDetailsV1Document } from "./bankAccountDetailsV1Document";

/**
 * Inference prediction for Bank Account Details, API version 1.
 */
export class BankAccountDetailsV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "bank_account_details";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: BankAccountDetailsV1Document;
  /** The document's pages. */
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
