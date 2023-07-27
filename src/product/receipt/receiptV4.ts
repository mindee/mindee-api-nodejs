import { Inference, StringDict, Page } from "../../parsing/common";
import { ReceiptV4Document } from "./receiptV4Document";

export class ReceiptV4 extends Inference {
  endpointName = "expense_receipts";
  endpointVersion = "4";
  prediction: ReceiptV4Document;
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
