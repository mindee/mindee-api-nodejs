import { OrientationField } from "./orientation";
import { Prediction } from "./prediction";
import { StringDict } from "./stringDict";

export class Page<PredictionType extends Prediction> {
  id: number | undefined;
  orientation: OrientationField | undefined;
  prediction: PredictionType;

  constructor(
    predictionType: new (rawPrediction: StringDict) => PredictionType,
    rawPrediction: StringDict,
    pageId?: number,
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
    this.id = pageId ?? undefined;
    this.prediction = new predictionType(rawPrediction);
  }

  toString() {
    const title = `Page ${this.id}`;
    return `
${title}
${"-".repeat(title.length)}
${this.prediction.toString()}`;
  }
}