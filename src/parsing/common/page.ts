import { OrientationField } from "./orientation";
import { Prediction } from "./prediction";

interface PageConstructorProps<PredictionType extends Prediction> {
  /** Prediction held by the page */
  prediction: PredictionType;
  /** Orientation JSON for page-level document */
  orientation?: OrientationField;
  /** Page ID for page-level document */
  pageId?: number;
}

export abstract class Page<PredictionType extends Prediction> {
  page_id: number | undefined;
  orientation: OrientationField | undefined;
  prediction: PredictionType;

  constructor({
    prediction,
    orientation = undefined,
    pageId = undefined,
  }: PageConstructorProps<PredictionType>) {
    if (pageId !== undefined && orientation !== undefined) {
      this.orientation = new OrientationField({
        prediction: orientation,
        pageId: pageId,
      });
    } else {
      orientation = undefined;
    }
    pageId = pageId ?? undefined;
    this.prediction = prediction;
  }
}