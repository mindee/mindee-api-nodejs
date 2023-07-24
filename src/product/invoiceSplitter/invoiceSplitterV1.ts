import { Inference, StringDict, Page } from "../../parsing/common";
import { InvoiceSplitterV1Document } from "./invoiceSplitterV1Document";

export class InvoiceSplitterV1 extends Inference {
  endpointName = "invoice_splitter";
  endpointVersion = "1";
  prediction: InvoiceSplitterV1Document;
  pages: Page<InvoiceSplitterV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new InvoiceSplitterV1Document(
      rawPrediction["prediction"]
    );
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          InvoiceSplitterV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
