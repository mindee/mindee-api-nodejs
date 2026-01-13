import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { BankAccountDetailsV1Document } from "./bankAccountDetailsV1Document.js";

/**
 * Bank Account Details API version 1 inference prediction.
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
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            BankAccountDetailsV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
