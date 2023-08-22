import { Inference, StringDict, Page } from "../../parsing/common";
import { FinancialDocumentV1Document } from "./financialDocumentV1Document";

/**
 * Inference prediction for Financial Document, API version 1.
 */
export class FinancialDocumentV1 extends Inference {
  /** Endpoint's name */
  endpointName = "financial_document";
  /** Endpoint's version */
  endpointVersion = "1";
  /** The document-level prediction */
  prediction: FinancialDocumentV1Document;
  /** The document's pages */
  pages: Page<FinancialDocumentV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new FinancialDocumentV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          FinancialDocumentV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
