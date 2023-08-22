import { Inference, StringDict, Page } from "../../parsing/common";
import { ReceiptV4Document } from "./receiptV4Document";

/**
 * Inference prediction for Receipt, API version 4.
 */
export class ReceiptV4 extends Inference {
  /** Endpoint's name */
  endpointName = "expense_receipts";
  /** Endpoint's version */
  endpointVersion = "4";
  /** The document-level prediction */
  prediction: ReceiptV4Document;
  /** The document's pages */
  pages: Page<ReceiptV4Document>[];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new ReceiptV4Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(ReceiptV4Document, page, page["id"], page["orientation"])
    );
  }
}
