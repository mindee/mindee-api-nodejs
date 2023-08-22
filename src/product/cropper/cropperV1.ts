import { Inference, Page, StringDict } from "../../parsing/common";
import { CropperV1Document } from "./cropperV1Document";

/**
 * Inference prediction for Cropper API, version 1.
 */
export class CropperV1 extends Inference {
  /** Endpoint's name */
  endpointName = "cropper";
  /** Endpoint's version */
  endpointVersion = "1";
  /** The document-level prediction */
  prediction: CropperV1Document;
  /** The document's pages */
  pages: Page<CropperV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new CropperV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(CropperV1Document, page, page["id"], page["orientation"])
    );
  }
}
