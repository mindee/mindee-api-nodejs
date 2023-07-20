import { cleanOutString } from "../../../parsing/common/summaryHelper";
import { Prediction, StringDict } from "../../../parsing/common";
import { TextField } from "../../../parsing/standard";

export class LicensePlateV1Document implements Prediction {
  endpointName = 'license_plates';
  endpointVersion = '1';
  /** A list of license plates. */
  licensePlates: TextField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    rawPrediction.hasOwnProperty("license_plates") && rawPrediction.license_plates.map((prediction: { [index: string]: any }) =>
      this.licensePlates.push(
        new TextField({
          prediction: prediction,
          pageId: pageId,
        })
      )
    );
  }

  toString(): string {
    const licensePlates = this.licensePlates
      .map((plate) => plate.value)
      .join("\n                ");
    const outStr = `License Plates: ${licensePlates}
`;
    return cleanOutString(outStr);
  }
}
