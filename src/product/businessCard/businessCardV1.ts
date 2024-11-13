import { Inference, StringDict, Page } from "../../parsing/common";
import { BusinessCardV1Document } from "./businessCardV1Document";

/**
 * Business Card API version 1 inference prediction.
 */
export class BusinessCardV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "business_card";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: BusinessCardV1Document;
  /** The document's pages. */
  pages: Page<BusinessCardV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new BusinessCardV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            BusinessCardV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
