import { Inference, Page, StringDict } from "../../parsing/common";
import { CustomV1Document } from "./customV1Document";
import { CustomV1Page } from "./customV1Page";

/**
 * Inference prediction for Custom builds.
 */
export class CustomV1 extends Inference {
  /** The endpoint's name. Note: placeholder for custom APIs. */
  endpointName = "custom";
  /** The endpoint's version. Note: placeholder for custom APIs. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: CustomV1Document;
  /** The document's pages. */
  pages: Page<CustomV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new CustomV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(CustomV1Page, page, page["id"], page["orientation"])
    );
  }
}
