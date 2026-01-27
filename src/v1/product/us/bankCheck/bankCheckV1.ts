import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { BankCheckV1Document } from "./bankCheckV1Document.js";
import { BankCheckV1Page } from "./bankCheckV1Page.js";

/**
 * Bank Check API version 1 inference prediction.
 */
export class BankCheckV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "bank_check";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: BankCheckV1Document;
  /** The document's pages. */
  pages: Page<BankCheckV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new BankCheckV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            BankCheckV1Page,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
