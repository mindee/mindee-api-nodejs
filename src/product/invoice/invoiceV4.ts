import { Inference, StringDict, Page } from "../../parsing/common";
import { InvoiceV4Document } from "./invoiceV4Document";

/**
 * Invoice API version 4 inference prediction.
 */
export class InvoiceV4 extends Inference {
  /** The endpoint's name. */
  endpointName = "invoices";
  /** The endpoint's version. */
  endpointVersion = "4";
  /** The document-level prediction. */
  prediction: InvoiceV4Document;
  /** The document's pages. */
  pages: Page<InvoiceV4Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new InvoiceV4Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            InvoiceV4Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
