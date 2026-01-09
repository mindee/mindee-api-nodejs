import { Inference, StringDict, Page } from "@/parsing/common/index.js";
import { EnergyBillV1Document } from "./energyBillV1Document.js";

/**
 * Energy Bill API version 1 inference prediction.
 */
export class EnergyBillV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "energy_bill_fra";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: EnergyBillV1Document;
  /** The document's pages. */
  pages: Page<EnergyBillV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new EnergyBillV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            EnergyBillV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
