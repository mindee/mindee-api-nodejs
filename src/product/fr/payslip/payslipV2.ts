import { Inference, StringDict, Page } from "../../../parsing/common";
import { PayslipV2Document } from "./payslipV2Document";

/**
 * Payslip API version 2 inference prediction.
 */
export class PayslipV2 extends Inference {
  /** The endpoint's name. */
  endpointName = "payslip_fra";
  /** The endpoint's version. */
  endpointVersion = "2";
  /** The document-level prediction. */
  prediction: PayslipV2Document;
  /** The document's pages. */
  pages: Page<PayslipV2Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new PayslipV2Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            PayslipV2Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
