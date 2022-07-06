import { promises as fs } from "fs";
import {
  Document,
  Passport,
  Receipt,
  Invoice,
  FinancialDocument,
  CustomDocument,
} from "../documents";
import { FullText } from "../documents/fields";
import { Input } from "../inputs";

interface ResponseProps {
  httpResponse: any;
  documentType: string;
  input: Input;
  error: boolean;
}

type stringDict = { [index: string]: any };

export class Response {
  httpResponse: any;
  readonly documentType: string;
  inputFile: Input;
  pages: Array<Document>;
  document?: Document;

  constructor({ httpResponse, documentType, input, error }: ResponseProps) {
    this.httpResponse = httpResponse;
    this.documentType = documentType;
    this.inputFile = input;
    this.pages = [];
    if (!error) {
      this.formatResponse();
    }
  }

  async dump(path: string) {
    return await fs.writeFile(path, JSON.stringify(Object.entries(this)));
  }

  formatResponse() {
    const constructors: { [index: string]: CallableFunction } = {
      receipt: (params: any) => new Receipt(params),
      invoice: (params: any) => new Invoice(params),
      financialDoc: (params: any) => new FinancialDocument(params),
      customDocument: (params: any) => new CustomDocument(params),
      passport: (params: any) => new Passport(params),
    };
    if (!(this.documentType in constructors)) {
      throw new Error(`Unknown document type: ${this.documentType}`);
    }
    const httpDataDocument = this.httpResponse.data.document;

    httpDataDocument.inference.pages.forEach((apiPage: stringDict) => {
      const pageText = new FullText();
      if (
        "ocr" in httpDataDocument &&
        Object.keys(httpDataDocument.ocr).length > 0
      ) {
        pageText.words =
          httpDataDocument.ocr["mvision-v1"].pages[apiPage.id].all_words;
      }
      this.pages.push(
        constructors[this.documentType]({
          apiPrediction: apiPage.prediction,
          inputFile: this.inputFile,
          documentType: this.documentType,
          pageNumber: apiPage.id,
          fullText: pageText,
        })
      );
    });

    this.document = constructors[this.documentType]({
      apiPrediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
      documentType: this.documentType,
    });
  }
}
