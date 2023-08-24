import { cleanOutString } from "../../parsing/common/summaryHelper";
import { Prediction, StringDict } from "../../parsing/common";
import { PositionField } from "../../parsing/standard";

/**
 * Document data for Cropper API, version 1.
 */
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

  /**
   * Default string representation.
   */
  toString(): string {
    const cropping = this.cropping
      .map((crop) => crop.toString())
      .join("\n           ");
    const outStr = `:Cropping: ${cropping}`.trim();
    return cleanOutString(outStr);
  }
}
