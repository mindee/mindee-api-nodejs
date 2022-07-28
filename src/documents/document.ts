import { Input } from "../inputs";
import { FullText } from "../fields";

export interface DocumentConstructorProps {
  apiPrediction: { [index: string]: any };
  inputFile?: Input;
  pageId?: number;
  fullText?: FullText;
}

export class Document {
  readonly internalDocType: string;
  checklist: { [index: string]: boolean };
  mimeType: string | undefined;
  filename: string = "";
  filepath: string | undefined;
  fullText?: FullText;
  pageId?: number | undefined;

  /**
   * Takes a list of Documents and return one Document where
   * each field is set with the maximum probability field
   * @param internalDocType - the internal document type
   * @param {Input} inputFile - input file given to parse the document
   * @param {number} pageId - Page ID for multi-page document
   * @param {FullText} fullText - full OCR extracted text
   */
  constructor(
    internalDocType: string,
    inputFile?: Input,
    pageId?: number,
    fullText?: FullText
  ) {
    this.internalDocType = internalDocType;
    this.filepath = undefined;
    this.pageId = pageId;

    if (inputFile !== undefined) {
      this.filepath = inputFile.filepath;
      this.filename = inputFile.filename;
      this.mimeType = inputFile.mimeType;
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
