import { CropperExtra } from "./extras/cropperExtra";
import { ExtraField, Extras } from "./extras/extras";
import { OrientationField } from "./orientation";
import { Prediction } from "./prediction";
import { StringDict } from "./stringDict";

export class Page<T extends Prediction> {
  id: number;
  orientation?: OrientationField;
  prediction: T;
  extras?: Extras;

  constructor(
    predictionType: new (rawPrediction: StringDict, pageId: number) => T,
    rawPrediction: StringDict,
    pageId: number,
    orientation?: StringDict
  ) {
    if (pageId !== undefined && orientation !== undefined) {
      this.orientation = new OrientationField({
        prediction: orientation,
        pageId: pageId,
      });
    } else {
      orientation = undefined;
    }
    this.id = pageId;
    this.prediction = new predictionType(rawPrediction["prediction"], pageId);
    if (
      rawPrediction["extras"] &&
      Object.keys(rawPrediction["extras"].length > 0)
    ) {
      const extras: Record<string, ExtraField> = {};
      Object.entries(rawPrediction["extras"]).forEach(
        ([extraKey, extraValue]: [string, any]) => {
          switch (extraKey) {
          case "cropper":
            extras["cropper"] = new CropperExtra(extraValue as StringDict);
          }
        }
      );
      this.extras = new Extras(extras);
    }
  }

  toString() {
    const title = `Page ${this.id}`;
    return `${title}
${"-".repeat(title.length)}
${this.prediction.toString()}
`;
  }
}
