import { CropperV1 } from "../../product";
import { Extras } from "./extras";
import { Inference } from "./inference";
import { Ocr } from "./ocr/ocr";
import { StringDict } from "./stringDict";


export class Document<T extends Inference> {
  filename: string;
  inference?: Inference;
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
    let extras: Extras = [];
    this.inference = new inferenceClass(httpResponse['inference']);
    if (httpResponse['extras'] && Object.keys(httpResponse['extras'].length > 0)) {
      Object.entries(httpResponse['extras']).forEach(([extraKey, extraValue]: [string, any]) => {
        switch (extraKey) {
          case "cropper":
            const cropperPrediction = extraValue as StringDict;
            extras.push(
              new CropperV1({ httpResponse: cropperPrediction, pageId: undefined })
            );
        }
      });
    }
    this.extras = extras;
  }

  toString() {
    return `########\nDocument\n########
:Mindee ID: ${this.id}
:Filename: ${this.filename}

${this.inference?.toString()}`;
  }
}
