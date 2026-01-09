import { Inference, StringDict, Page } from "@/parsing/common/index.js";
import { PayslipV3Document } from "./payslipV3Document.js";

/**
 * Payslip API version 3 inference prediction.
 */
export class PayslipV3 extends Inference {
  /** The endpoint's name. */
  endpointName = "payslip_fra";
  /** The endpoint's version. */
  endpointVersion = "3";
  /** The document-level prediction. */
  prediction: PayslipV3Document;
  /** The document's pages. */
  pages: Page<PayslipV3Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new PayslipV3Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            PayslipV3Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
