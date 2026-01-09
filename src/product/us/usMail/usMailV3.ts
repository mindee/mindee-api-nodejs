import { Inference, StringDict, Page } from "@/parsing/common/index.js";
import { UsMailV3Document } from "./usMailV3Document.js";

/**
 * US Mail API version 3 inference prediction.
 */
export class UsMailV3 extends Inference {
  /** The endpoint's name. */
  endpointName = "us_mail";
  /** The endpoint's version. */
  endpointVersion = "3";
  /** The document-level prediction. */
  prediction: UsMailV3Document;
  /** The document's pages. */
  pages: Page<UsMailV3Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new UsMailV3Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            UsMailV3Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
