import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { MultiReceiptsDetectorV1Document } from "./multiReceiptsDetectorV1Document.js";

/**
 * Multi Receipts Detector API version 1 inference prediction.
 */
export class MultiReceiptsDetectorV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "multi_receipts_detector";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: MultiReceiptsDetectorV1Document;
  /** The document's pages. */
  pages: Page<MultiReceiptsDetectorV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new MultiReceiptsDetectorV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            MultiReceiptsDetectorV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
