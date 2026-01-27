import { Inference, StringDict, Page } from "@/v1/parsing/common/index.js";
import { DriverLicenseV1Document } from "./driverLicenseV1Document.js";

/**
 * Driver License API version 1 inference prediction.
 */
export class DriverLicenseV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "driver_license";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: DriverLicenseV1Document;
  /** The document's pages. */
  pages: Page<DriverLicenseV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new DriverLicenseV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            DriverLicenseV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}
