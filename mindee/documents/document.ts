import { promises as fs } from "fs";
import { Input } from "../inputs";
import { Polygon } from "../geometry";

export interface DocumentConstructorProps {
  apiPrediction: { [index: string]: any };
  inputFile?: Input;
  pageNumber?: number;
  fullText?: FullText;
}

type Word = {
  polygon: Polygon;
  text: string;
  confidence: number;
};

export class FullText {
  words: Word[] = [];
}

export class Document {
  readonly documentType: string;
  checklist: { [index: string]: boolean };
  mimeType: string | undefined;
  filename: string = "";
  filepath: string | undefined;
  fullText?: FullText;
  pageNumber?: number | undefined;

  /**
   * Takes a list of Documents and return one Document where
   * each field is set with the maximum probability field
   * @param documentType - the internal document type
   * @param {Input} inputFile - input file given to parse the document
   * @param {number} pageNumber - Page number (ID)
   * @param {FullText} fullText - full OCR extracted text
   */
  constructor(
    documentType: string,
    inputFile?: Input,
    pageNumber?: number,
    fullText?: FullText
  ) {
    this.documentType = documentType;
    this.filepath = undefined;
    this.pageNumber = pageNumber;

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

  /** Export document into a JSON file */
  async dump(path: any) {
    return await fs.writeFile(path, JSON.stringify(Object.entries(this)));
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
