import { CropperExtra } from "./extras/cropperExtra";
import { ExtraField, Extras } from "./extras/extras";
import { OrientationField } from "./orientation";
import { Prediction } from "./prediction";
import { StringDict } from "./stringDict";


/**
 * Page prediction wrapper class. Holds the results of a parsed document's page.
 * Holds a `Prediction` that's either a document-level Prediction, or inherits from one.
 * @typeParam T an extension of an `Prediction`. Mandatory in order to properly create a page-level prediction.
 */
export class Page<T extends Prediction> {
  /** The page's index (identifier). */
  id: number;
  /** The page's orientation */
  orientation?: OrientationField;
  /** A page-level prediction. Can either be specific to pages or identical to the document prediction. */
  prediction: T;
  /** Potential `Extras` fields sent back along with the prediction. */
  extras?: Extras;

  /**
   * 
   * @param inferenceClass constructor signature for an inference.
   * @param httpResponse raw http response.
   * @param pageId the page's index (identifier).
   * @param orientation the page's orientation.
   */
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

  /**
   * Default string representation.
   */
  toString() {
    const title = `Page ${this.id}`;
    return `${title}
${"-".repeat(title.length)}
${this.prediction.toString()}
`;
  }
}
