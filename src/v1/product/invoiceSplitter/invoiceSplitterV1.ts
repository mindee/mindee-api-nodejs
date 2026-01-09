import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { InvoiceSplitterV1Document } from "./invoiceSplitterV1Document.js";

/**
 * Invoice Splitter API version 1 inference prediction.
 */
export class InvoiceSplitterV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "invoice_splitter";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: InvoiceSplitterV1Document;
  /** The document's pages. */
  pages: Page<InvoiceSplitterV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new InvoiceSplitterV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            InvoiceSplitterV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
