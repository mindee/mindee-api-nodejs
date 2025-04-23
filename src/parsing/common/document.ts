import { CropperExtra, FullTextOcrExtra } from "./extras";
import { ExtraField, Extras } from "./extras/extras";
import { Inference } from "./inference";
import { Ocr } from "./ocr";
import { StringDict } from "./stringDict";
import { RAGExtra } from "./extras/ragExtra";

/**
 * Document prediction wrapper class. Holds the results of a parsed document.
 * @typeParam T an extension of an `Inference`. Mandatory in order to properly create an inference.
 */
export class Document<T extends Inference> {
  /** File name as sent back by the server. */
  filename: string;
  /** Result of the base inference. */
  inference: T;
  /** ID of the document as sent back by the server. */
  id: string;
  /** Potential `Extras` fields sent back along the prediction. */
  extras?: Extras;
  /** Raw-text response for `allWords` parsing. */
  ocr?: Ocr;
  /** Page number as sent back by the API. */
  nPages: number;

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
    this.ocr = httpResponse.ocr && Object.keys(httpResponse.ocr).length > 0 ? new Ocr(httpResponse.ocr) : undefined;
    this.inference = new inferenceClass(httpResponse["inference"]);
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
            break;
          case "full_text_ocr":
            extras["fullTextOcr"] = new FullTextOcrExtra(extraValue as StringDict);
            break;
          case "rag":
            extras["rag"] = new RAGExtra(extraValue as StringDict);
            break;
          }
        }
      );
      this.extras = new Extras(extras);
    }
    if (!this.extras || !("fullTextOcr" in this.extras) || this.extras["full_text_ocr"].toString().length === 0) {
      this.injectFullTextOcr(httpResponse);
    }
    this.nPages = httpResponse["n_pages"];
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

  private injectFullTextOcr(rawPrediction: StringDict) {
    if (
      rawPrediction["inference"]["pages"].length < 1 ||
      rawPrediction["inference"]["pages"][0]["extras"].length < 1 ||
      !("full_text_ocr" in rawPrediction["inference"]["pages"][0]["extras"]) ||
        !rawPrediction["inference"]["pages"][0]["extras"]["full_text_ocr"] ||
        !("content" in rawPrediction["inference"]["pages"][0]["extras"]["full_text_ocr"]) ||
        !rawPrediction["inference"]["pages"][0]["extras"]["full_text_ocr"]["content"]
    ) {
      return;
    }
    const fullTextOcr = rawPrediction["inference"]["pages"].filter(
      (e: StringDict) => "extras" in e
    ).map(
      (e: StringDict) => e["extras"]["full_text_ocr"]["content"]
    ).join("\n");
    const artificialTextObj = { "content": fullTextOcr.length > 0 ? fullTextOcr : "" };
    if (!this.extras) {
      this.extras = new Extras({ "fullTextOcr": new FullTextOcrExtra(artificialTextObj) });
    } else {
      this.extras["fullTextOcr"] = new FullTextOcrExtra(artificialTextObj);
    }
  }
}
