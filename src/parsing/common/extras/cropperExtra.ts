import { PositionField } from "../../standard";
import { StringDict } from "../stringDict";
import { cleanOutString } from "../summaryHelper";
import { ExtraField } from "./extras";

export class CropperExtra extends ExtraField {
  cropping: PositionField[] = [];
  constructor(rawPrediction: StringDict, pageId?: number) {
    super();
    rawPrediction["cropping"] !== undefined &&
      rawPrediction["cropping"].forEach((crop: any) => {
        this.cropping.push(
          new PositionField({
            prediction: crop,
            pageId: pageId,
          })
        );
      });
  }
  toString() {
    const cropping = this.cropping
      .map((crop) => crop.toString())
      .join("\n          ");
    return cleanOutString(cropping);
  }
}
