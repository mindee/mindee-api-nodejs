import { Inference, StringDict, Page } from "../../../parsing/common";
import { DriverLicenseV1Document } from "./driverLicenseV1Document";
import { DriverLicenseV1Page } from "./driverLicenseV1Page";

export class DriverLicenseV1 extends Inference {
  endpointName = "us_driver_license";
  endpointVersion = "1";
  prediction: DriverLicenseV1Document;
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
