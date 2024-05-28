import { Inference, StringDict, Page } from "../../../parsing/common";
import { UsMailV2Document } from "./usMailV2Document";

/**
 * US Mail API version 2 inference prediction.
 */
export class UsMailV2 extends Inference {
  /** The endpoint's name. */
  endpointName = "us_mail";
  /** The endpoint's version. */
  endpointVersion = "2";
  /** The document-level prediction. */
  prediction: UsMailV2Document;
  /** The document's pages. */
  pages: Page<UsMailV2Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new UsMailV2Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            UsMailV2Document,
            page,
            page["id"],
            page["orientation"]
          ))
        }
      }
    );
  }
}
