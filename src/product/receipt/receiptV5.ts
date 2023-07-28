import { Inference, StringDict, Page } from "../../parsing/common";
import { ReceiptV5Document } from "./receiptV5Document";

export class ReceiptV5 extends Inference {
  endpointName = "expense_receipts";
  endpointVersion = "5";
  prediction: ReceiptV5Document;
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
