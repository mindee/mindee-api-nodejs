import { CropperV1, MindeeVisionV1 } from "src/product";
import { Extras } from "./extras";
import { Inference } from "./inference";
import { Prediction } from "./prediction";
import { StringDict } from "./stringDict";
import { OrientationField } from "./orientation";

export type DocumentSig<DocType extends Document> = {
  new({
    prediction,
    extras,
    documentType,
  }: DocumentConstructorProps): DocType;
};

export interface DocumentConstructorProps extends BaseDocumentConstructorProps {
  /** JSON parsed prediction from HTTP response */
  prediction: StringDict;
}

interface BaseDocumentConstructorProps {
  httpResponse: StringDict;
  documentType?: string;
  extras?: Extras;
}

export abstract class Document<DocT extends Inference<Prediction, Prediction>> {
  filename: string = "";
  inference: DocT;
  id: string;
  extras?: Extras;
  ocr?: MindeeVisionV1;// TODO: UPDATE TO OCR

  constructor({
    documentType,
    httpResponse
  }: BaseDocumentConstructorProps) {
    this.id = httpResponse["id"];
    this.inference = httpResponse["inference"];
    this.ocr = httpResponse["ocr"] ?? undefined;
    let extras:Extras = [];
    if (httpResponse['extras'] && Object.keys(httpResponse['extras'].length > 0)) {
      Object.entries(httpResponse['extras']).forEach(([extraKey, extraValue]: [string, any]) => {
        switch (extraKey){
          case "cropper":
            const cropperPrediction = extraValue as StringDict;
            extras.push(
              new CropperV1({cropperPrediction})
            );
        }
      });
    }
    this.extras = extras;
  }

  clone() {
    return JSON.parse(JSON.stringify(this));
  }

  /** return true if all checklist of the document if true */
  checkAll() {
    return Object.values(this.checklist).every((item) => item);
  }

  /**
   * Takes a list of Documents and return one Document where
   * each field is set with the maximum probability field
   * @param {Array<Document>} documents - A list of Documents
   */
  static mergePages(documents: any) {
    const finalDocument = documents[0].clone();
    const attributes = Object.getOwnPropertyNames(finalDocument);
    for (const document of documents) {
      for (const attribute of attributes) {
        if (Array.isArray(document?.[attribute])) {
          finalDocument[attribute] = finalDocument[attribute]?.length
            ? finalDocument[attribute]
            : document?.[attribute];
        } else if (
          document?.[attribute]?.confidence >
          finalDocument[attribute].confidence
        ) {
          finalDocument[attribute] = document?.[attribute];
        }
      }
    }
    return finalDocument;
  }

  static cleanOutString(outStr: string): string {
    const lines = / \n/gm;
    return outStr.replace(lines, "\n");
  }
}
