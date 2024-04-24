import {
  Prediction,
  StringDict,
  cleanOutString,
} from "../../../parsing/common";
import { StringField } from "../../../parsing/standard";

/**
 * License Plate API version 1.1 document data.
 */
export class LicensePlateV1Document implements Prediction {
  /** List of all license plates found in the image. */
  licensePlates: StringField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    rawPrediction["license_plates"] &&
      rawPrediction["license_plates"].map(
        (itemPrediction: StringDict) =>
          this.licensePlates.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const licensePlates = this.licensePlates.join("\n                 ");
    const outStr = `:License Plates: ${licensePlates}`.trimEnd();
    return cleanOutString(outStr);
  }
}
