import { PositionField } from "@/v1/parsing/standard/position.js";
import { StringDict } from "@/parsing/stringDict.js";
import { cleanOutString } from "../summaryHelper.js";
import { ExtraField } from "./extras.js";

export class CropperExtra extends ExtraField {
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
