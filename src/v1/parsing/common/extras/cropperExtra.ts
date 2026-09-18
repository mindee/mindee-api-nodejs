import { StringDict } from "@/parsing/stringDict.js";
import { PositionField } from "@/v1/parsing/standard/position.js";
import { cleanOutString } from "@/v1/parsing/common/summaryHelper.js";
import { ExtraField } from "./extras.js";

/** Cropper extra payload returned by compatible APIs. */
export class CropperExtra extends ExtraField {
  /** Cropped regions detected on the page. */
  cropping: PositionField[] = [];
  constructor(rawPrediction: StringDict, pageId?: number) {
    super();
    if (rawPrediction["cropping"] !== undefined) {
      rawPrediction["cropping"].forEach((crop: any) => {
        this.cropping.push(
          new PositionField({
            prediction: crop,
            pageId: pageId,
          })
        );
      });
    }
  }

  /**
   * Default string representation.
   */
  toString() {
    const cropping = this.cropping
      .map((crop) => crop.toString())
      .join("\n           ");
    return cleanOutString(cropping);
  }
}
