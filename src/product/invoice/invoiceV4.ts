import { Inference, StringDict, Page } from "../../parsing/common";
import { InvoiceV4Document } from "./invoiceV4Document";

export class InvoiceV4 extends Inference {
  endpointName = "invoices";
  endpointVersion = "4";
  prediction: InvoiceV4Document;
  pages: Page<InvoiceV4Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new InvoiceV4Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(InvoiceV4Document, page, page["id"], page["orientation"])
    );
  }
}
