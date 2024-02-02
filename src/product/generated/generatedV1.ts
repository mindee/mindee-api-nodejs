import { Inference, Page, StringDict } from "../../../src/parsing/common";
import { GeneratedV1Document } from "./generatedV1Document";
import { GeneratedV1Page } from "./generatedV1Page";

/**
 * Generated API V1 inference results.
 */
export class GeneratedV1 extends Inference {
  /** The endpoint's name. Note: placeholder for custom APIs. */
  endpointName = "custom";
  /** The endpoint's version. Note: placeholder for custom APIs. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: GeneratedV1Document;
  /** The document's pages. */
  pages: Page<GeneratedV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new GeneratedV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(GeneratedV1Page, page,
          page["id"])
    )
  }
}
