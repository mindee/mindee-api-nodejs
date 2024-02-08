import { Inference, StringDict, Page } from "../../parsing/common";
import { MultiReceiptsDetectorV1Document } from "./multiReceiptsDetectorV1Document";

/**
 * Inference prediction for Multi Receipts Detector, API version 1.
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
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          MultiReceiptsDetectorV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}