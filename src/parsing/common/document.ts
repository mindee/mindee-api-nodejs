import { InputSource } from "../../input";
import { PositionField, FullText } from "../standard";

import { OrientationField, StringDict } from "../common";

export type DocumentSig<DocType extends Document> = {
  new ({
    prediction,
    orientation,
    extras,
    pageId,
    fullText,
    documentType,
    inputSource = undefined,
  }: DocumentConstructorProps): DocType;
};

export interface DocumentConstructorProps extends BaseDocumentConstructorProps {
  /** JSON parsed prediction from HTTP response */
  prediction: StringDict;
}

interface BaseDocumentConstructorProps {
  /** Orientation JSON for page-level document */
  orientation?: StringDict;
  /** Extras JSON */
  extras?: StringDict;
  /** input file given to parse the document */
  inputSource?: InputSource;
  /** Page ID for page-level document */
  pageId?: number;
  /** full OCR extracted text */
  fullText?: FullText;
  documentType?: string;
}

export class Document {
  checklist: { [index: string]: boolean };
  mimeType?: string;
  filename: string = "";
  filepath?: string;
  fullText?: FullText;
  pageId?: number | undefined;
  orientation?: OrientationField;
  cropper: PositionField[] = [];
  readonly docType: string;

  constructor({
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    fullText = undefined,
    pageId = undefined,
    documentType,
  }: BaseDocumentConstructorProps) {
    this.filepath = undefined;
    this.pageId = pageId;
    if (documentType === undefined || documentType === "") {
      this.docType = Object.getPrototypeOf(this).constructor.name;
    } else {
      this.docType = documentType;
    }

    if (pageId !== undefined && orientation !== undefined) {
      this.orientation = new OrientationField({
        prediction: orientation,
        pageId: pageId,
      });
    }
    if (extras !== undefined) {
      if (extras.cropper !== undefined) {
        extras.cropper.cropping.forEach((crop: any) => {
          this.cropper.push(
            new PositionField({
              prediction: crop,
              pageId: pageId,
            })
          );
        });
      }
    }

    if (inputSource !== undefined) {
      this.filepath = inputSource.filepath;
      this.filename = inputSource.filename;
      this.mimeType = inputSource.mimeType;
    }
    this.fullText = fullText;
    this.checklist = {};
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
