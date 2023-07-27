import {
  cleanOutString,
  Prediction,
  StringDict,
} from "../../../parsing/common";
import { StringField } from "../../../parsing/standard";

export class LicensePlateV1Document implements Prediction {
  /** A list of license plates. */
  licensePlates: StringField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    rawPrediction["license_plates"] &&
      rawPrediction["license_plates"].forEach(
        (itemPrediction: { [index: string]: any }) =>
          this.licensePlates.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
  }

  toString(): string {
    const licensePlates = this.licensePlates
      .map((plate) => plate.value)
      .join("\n                 ");
    const outStr = `:License Plates: ${licensePlates}`;
    return cleanOutString(outStr);
  }
}
