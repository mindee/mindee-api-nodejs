import { CropperExtra } from "./extras/cropperExtra";
import { ExtraField, Extras } from "./extras/extras";
import { Inference } from "./inference";
import { Ocr } from "./ocr";
import { StringDict } from "./stringDict";

export class Document<T extends Inference> {
  filename: string;
  inference: T;
  id: string;
  extras?: Extras;
  ocr?: Ocr;

  constructor(
    inferenceClass: new (httpResponse: StringDict) => T,
    httpResponse: StringDict
  ) {
    this.id = httpResponse["id"] ?? "";
    this.filename = httpResponse["name"] ?? "";
    this.ocr = httpResponse["ocr"] ?? undefined;
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

  toString() {
    return `########\nDocument\n########
:Mindee ID: ${this.id}
:Filename: ${this.filename}

${this.inference?.toString()}`;
  }
}
