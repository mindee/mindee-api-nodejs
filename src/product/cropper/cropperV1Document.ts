import { cleanOutString } from "../../parsing/common/summaryHelper";
import { Prediction, StringDict } from "../../parsing/common";
import { PositionField } from "../../parsing/standard";

export class CropperV1Document implements Prediction {
  /** A list of cropped positions. */
  cropping: PositionField[] = [];

  constructor(rawPrediction: StringDict, pageId?: number) {
    rawPrediction["cropping"] &&
      rawPrediction["cropping"].forEach((crop: any) => {
        this.cropping.push(
          new PositionField({
            prediction: crop,
            pageId: pageId,
          })
        );
      });
  }

  toString(): string {
    const cropping = this.cropping
      .map((crop) => crop.toString())
      .join("\n          ");
    const outStr = `Cropping: ${cropping}`;
    return cleanOutString(outStr);
  }
}
