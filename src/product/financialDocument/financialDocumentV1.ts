import { Inference, StringDict, Page } from "../../parsing/common";
import { FinancialDocumentV1Document } from "./financialDocumentV1Document";

export class FinancialDocumentV1 extends Inference {
  endpointName = "financial_document";
  endpointVersion = "1";
  prediction: FinancialDocumentV1Document;
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
