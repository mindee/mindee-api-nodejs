import { Inference, StringDict, Page } from "../../parsing/common";
import { ReceiptV5Document } from "./receiptV5Document";

/**
 * Receipt API version 5 inference prediction.
 */
export class ReceiptV5 extends Inference {
  /** The endpoint's name. */
  endpointName = "expense_receipts";
  /** The endpoint's version. */
  endpointVersion = "5";
  /** The document-level prediction. */
  prediction: ReceiptV5Document;
  /** The document's pages. */
  pages: Page<ReceiptV5Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new ReceiptV5Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            ReceiptV5Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
