import { Inference, StringDict, Page } from "../../parsing/common";
import { InvoiceSplitterV1Document } from "./invoiceSplitterV1Document";

/**
 * Inference prediction for Invoice Splitter, API version 1.
 */
export class InvoiceSplitterV1 extends Inference {
  /** Endpoint's name */
  endpointName = "invoice_splitter";
  /** Endpoint's version */
  endpointVersion = "1";
  /** The document-level prediction */
  prediction: InvoiceSplitterV1Document;
  /** The document's pages */
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
