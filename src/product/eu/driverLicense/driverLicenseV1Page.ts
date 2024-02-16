import { StringDict, cleanOutString } from "../../../parsing/common";
import { PositionField } from "../../../parsing/standard";

import { DriverLicenseV1Document } from "./driverLicenseV1Document";

/**
 * Page data for EU Driver License, API version 1.
 */
export class DriverLicenseV1Page extends DriverLicenseV1Document {
  /** Has a photo of the EU driver license holder */
  photo: PositionField;
  /** Has a signature of the EU driver license holder */
  signature: PositionField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    super(rawPrediction, pageId);

    this.photo = new PositionField({
      prediction: rawPrediction["photo"],
      pageId: pageId,
    });
    this.signature = new PositionField({
      prediction: rawPrediction["signature"],
      pageId: pageId,
    });
  }

  toString(): string {
    let outStr = `:Photo: ${this.photo}
:Signature: ${this.signature}`.trimEnd();
    outStr += "\n" + super.toString();
    return cleanOutString(outStr);
  }
}
