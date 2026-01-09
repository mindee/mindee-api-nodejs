import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { IndianPassportV1Document } from "./indianPassportV1Document.js";

/**
 * Passport - India API version 1 inference prediction.
 */
export class IndianPassportV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "ind_passport";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: IndianPassportV1Document;
  /** The document's pages. */
  pages: Page<IndianPassportV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new IndianPassportV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            IndianPassportV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
