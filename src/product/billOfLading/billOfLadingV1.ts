import { Inference, StringDict, Page } from "../../parsing/common";
import { BillOfLadingV1Document } from "./billOfLadingV1Document";

/**
 * Bill of Lading API version 1 inference prediction.
 */
export class BillOfLadingV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "bill_of_lading";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: BillOfLadingV1Document;
  /** The document's pages. */
  pages: Page<BillOfLadingV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new BillOfLadingV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            BillOfLadingV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
