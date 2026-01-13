import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { BankAccountDetailsV2Document } from "./bankAccountDetailsV2Document.js";

/**
 * Bank Account Details API version 2 inference prediction.
 */
export class BankAccountDetailsV2 extends Inference {
  /** The endpoint's name. */
  endpointName = "bank_account_details";
  /** The endpoint's version. */
  endpointVersion = "2";
  /** The document-level prediction. */
  prediction: BankAccountDetailsV2Document;
  /** The document's pages. */
  pages: Page<BankAccountDetailsV2Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new BankAccountDetailsV2Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            BankAccountDetailsV2Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
