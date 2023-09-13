import { Inference, StringDict, Page } from "../../parsing/common";
import { BarcodeReaderV1Document } from "./barcodeReaderV1Document";

/**
 * Inference prediction for Barcode Reader, API version 1.
 */
export class BarcodeReaderV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "barcode_reader";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: BarcodeReaderV1Document;
  /** The document's pages. */
  pages: Page<BarcodeReaderV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new BarcodeReaderV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          BarcodeReaderV1Document,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
