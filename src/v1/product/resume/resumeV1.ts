import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { ResumeV1Document } from "./resumeV1Document.js";

/**
 * Resume API version 1 inference prediction.
 */
export class ResumeV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "resume";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: ResumeV1Document;
  /** The document's pages. */
  pages: Page<ResumeV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new ResumeV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            ResumeV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
