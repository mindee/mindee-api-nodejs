import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { BarcodeReaderV1Document } from "./barcodeReaderV1Document.js";

/**
 * Barcode Reader API version 1 inference prediction.
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
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            BarcodeReaderV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
