import { Inference, StringDict, Page } from "../../parsing/common";
import { CropperV1Document } from "./cropperV1Document";
import { CropperV1Page } from "./cropperV1Page";

/**
 * Inference prediction for Cropper, API version 1.
 */
export class CropperV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "cropper";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: CropperV1Document;
  /** The document's pages. */
  pages: Page<CropperV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new CropperV1Document();
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            CropperV1Page,
            page,
            page["id"],
            page["orientation"]
          ))
        }
      }
    );
  }
}
