import { Inference, StringDict, Page } from "../../../parsing/common";
import { W9V1Document } from "./w9V1Document";
import { W9V1Page } from "./w9V1Page";

/**
 * Inference prediction for W9, API version 1.
 */
export class W9V1 extends Inference {
  /** The endpoint's name. */
  endpointName = "us_w9";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: W9V1Document;
  /** The document's pages. */
  pages: Page<W9V1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new W9V1Document();
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          W9V1Page,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
