import { OrientationField } from "./orientation";
import { Prediction } from "./prediction";
import { StringDict } from "./stringDict";

export class Page<T extends Prediction> {
  id: number | undefined;
  orientation: OrientationField | undefined;
  prediction: T;

  constructor(
    predictionType: new (rawPrediction: StringDict, pageId?: number) => T,
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
    this.prediction = new predictionType(rawPrediction, pageId);
  }

  toString() {
    const title = `Page ${this.id}`;
    return `
${title}
${"-".repeat(title.length)}
${this.prediction.toString()}`;
  }
}