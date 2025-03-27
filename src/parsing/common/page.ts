import { CropperExtra, FullTextOcrExtra } from "./extras";
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
   * @param predictionType constructor signature for an inference.
   * @param rawPrediction raw http response.
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
            break;
          case "full_text_ocr":
            extras["fullTextOcr"] = new FullTextOcrExtra(extraValue as StringDict);
            break;
          }
        }
      );
      this.extras = new Extras(extras);
    }
    if (!this.extras || !("fullTextOcr" in this.extras) || this.extras["fullTextOcr"].toString().length === 0) {
      this.injectFullTextOcr(rawPrediction);
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

  private injectFullTextOcr(rawPrediction: StringDict) {
    if (!("extras" in rawPrediction) || !("full_text_ocr" in rawPrediction["extras"])) {
      return;
    }
    if (
      !rawPrediction["extras"]
      || rawPrediction["extras"] === null ||
      !rawPrediction["extras"]["full_text_ocr"] ||
      rawPrediction["extras"]["full_text_ocr"] === null ||
      !rawPrediction["extras"]["full_text_ocr"]["content"] ||
      rawPrediction["extras"]["full_text_ocr"]["content"] === null
    ) {
      return;
    }
    const fullTextOcr = rawPrediction["extras"]["full_text_ocr"]["content"];
    const artificialTextObj = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "full_text_ocr": {
        "content": fullTextOcr.length > 0 ? fullTextOcr : "",
      },
    };
    if (!this.extras) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      this.extras = new Extras({ "full_text_ocr": new FullTextOcrExtra(artificialTextObj) });
    } else {
      this.extras["fullTextOcr"] = new FullTextOcrExtra(artificialTextObj);
    }
  }
}
