import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { FinancialDocumentV1Document } from "./financialDocumentV1Document.js";

/**
 * Financial Document API version 1 inference prediction.
 */
export class FinancialDocumentV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "financial_document";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: FinancialDocumentV1Document;
  /** The document's pages. */
  pages: Page<FinancialDocumentV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new FinancialDocumentV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            FinancialDocumentV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
