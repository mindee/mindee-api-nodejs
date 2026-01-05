import { Inference, StringDict, Page } from "@/parsing/common/index.js";
import { InternationalIdV2Document } from "./internationalIdV2Document.js";

/**
 * International ID API version 2 inference prediction.
 */
export class InternationalIdV2 extends Inference {
  /** The endpoint's name. */
  endpointName = "international_id";
  /** The endpoint's version. */
  endpointVersion = "2";
  /** The document-level prediction. */
  prediction: InternationalIdV2Document;
  /** The document's pages. */
  pages: Page<InternationalIdV2Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new InternationalIdV2Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            InternationalIdV2Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
