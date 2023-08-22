import { Inference, StringDict, Page } from "../../../parsing/common";
import { DriverLicenseV1Document } from "./driverLicenseV1Document";
import { DriverLicenseV1Page } from "./driverLicenseV1Page";

/**
 * Inference prediction for Driver License, API version 1.
 */
export class DriverLicenseV1 extends Inference {
  /** Endpoint's name */
  endpointName = "us_driver_license";
  /** Endpoint's version */
  endpointVersion = "1";
  /** The document-level prediction */
  prediction: DriverLicenseV1Document;
  /** The document's pages */
  pages: Page<DriverLicenseV1Page>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new DriverLicenseV1Document(rawPrediction["prediction"]);
    this.pages = rawPrediction["pages"].map(
      (page: StringDict) =>
        new Page(
          DriverLicenseV1Page,
          page,
          page["id"],
          page["orientation"]
        )
    );
  }
}
