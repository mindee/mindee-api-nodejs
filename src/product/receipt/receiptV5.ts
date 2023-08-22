import { Inference, StringDict, Page } from "../../parsing/common";
import { ReceiptV5Document } from "./receiptV5Document";

/**
 * Inference prediction for Receipt, API version 5.
 */
export class ReceiptV5 extends Inference {
  /** Endpoint's name */
  endpointName = "expense_receipts";
  /** Endpoint's version */
  endpointVersion = "5";
  /** The document-level prediction */
  prediction: ReceiptV5Document;
  /** The document's pages */
  pages: Page<ReceiptV5Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new ReceiptV5Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          ReceiptV5Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
