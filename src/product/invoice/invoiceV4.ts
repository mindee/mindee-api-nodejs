import { Inference, StringDict, Page } from "../../parsing/common";
import { InvoiceV4Document } from "./invoiceV4Document";

/**
 * Inference prediction for Invoice, API version 4.
 */
export class InvoiceV4 extends Inference {
  /** Endpoint's name */
  endpointName = "invoices";
  /** Endpoint's version */
  endpointVersion = "4";
  /** The document-level prediction */
  prediction: InvoiceV4Document;
  /** The document's pages */
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
