import { Inference, StringDict, Page } from "../../../parsing/common";
import { BankCheckV1Document } from "./bankCheckV1Document";
import { BankCheckV1Page } from "./bankCheckV1Page";

/**
 * Inference prediction for Bank Check, API version 1.
 */
export class BankCheckV1 extends Inference {
  /** Endpoint's name */
  endpointName = "bank_check";
  /** Endpoint's version */
  endpointVersion = "1";
  /** The document-level prediction */
  prediction: BankCheckV1Document;
  /** The document's pages */
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
