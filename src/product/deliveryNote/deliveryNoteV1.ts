import { Inference, StringDict, Page } from "../../parsing/common";
import { DeliveryNoteV1Document } from "./deliveryNoteV1Document";

/**
 * Delivery note API version 1 inference prediction.
 */
export class DeliveryNoteV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "delivery_notes";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: DeliveryNoteV1Document;
  /** The document's pages. */
  pages: Page<DeliveryNoteV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new DeliveryNoteV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            DeliveryNoteV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
