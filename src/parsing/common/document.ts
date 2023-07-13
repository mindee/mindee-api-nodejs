import { CropperV1, MindeeVisionV1 } from "../../product";
import { Extras } from "./extras";
import { Inference } from "./inference";
import { Prediction } from "./prediction";
import { StringDict } from "./stringDict";

export interface DocumentConstructorProps<T extends Prediction> extends BaseDocumentConstructorProps<T> {
  pageId?: number;
}

interface BaseDocumentConstructorProps<T extends Prediction> {
  httpResponse: StringDict;
  documentType: new (httpResponse: StringDict) => Inference;
  extras?: Extras;
}

export class Document<T extends Inference> {
  filename: string;
  inference?: Inference;
  id: string;
  extras?: Extras;
  ocr?: MindeeVisionV1;// TODO: UPDATE TO OCR

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
:Mindee ID: ${this.inference?.toString()}`;
  }
}
