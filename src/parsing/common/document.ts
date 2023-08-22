import { CropperExtra } from "./extras/cropperExtra";
import { ExtraField, Extras } from "./extras/extras";
import { Inference } from "./inference";
import { Ocr } from "./ocr";
import { StringDict } from "./stringDict";

/**
 * Document prediction wrapper class. Holds the results of a parsed document.
 * @typeParam T an extension of an `Inference`. Mandatory in order to properly create an inference.
 */
export class Document<T extends Inference> {
  /** File name as sent back by the server */
  filename: string;
  /** Result of the base inference */
  inference: T;
  /** Id of the document as sent back by the server */
  id: string;
  /** Potential `Extras` fields sent back along the prediction */
  extras?: Extras;
  /** Raw-text response for `allWords` parsing. */
  ocr?: Ocr;

  /**
   * 
   * @param inferenceClass constructor signature for an inference.
   * @param httpResponse raw http response.
   */
  constructor(
    inferenceClass: new (httpResponse: StringDict) => T,
    httpResponse: StringDict
  ) {
    this.id = httpResponse?.id ?? "";
    this.filename = httpResponse?.name ?? "";
    this.ocr = httpResponse?.ocr ?? undefined;
    this.inference = new inferenceClass(httpResponse["inference"]);
    // Note: this is a convoluted but functional way of being able to implement/use Extras fields
    // as an extension of a Map object (like having an adapted toString() method, for instance)
    if (
      httpResponse["extras"] &&
      Object.keys(httpResponse["extras"].length > 0)
    ) {
      const extras: Record<string, ExtraField> = {};
      Object.entries(httpResponse["extras"]).forEach(
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
    return `########\nDocument\n########
:Mindee ID: ${this.id}
:Filename: ${this.filename}

${this.inference?.toString()}`;
  }
}
