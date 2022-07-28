import {
  Document,
  Passport,
  Receipt,
  Invoice,
  FinancialDocument,
  CustomDocument,
  DOC_TYPE_INVOICE,
  DOC_TYPE_RECEIPT,
  DOC_TYPE_PASSPORT,
  DOC_TYPE_FINANCIAL,
} from "../documents";
import { FullText } from "../fields";
import { Input } from "../inputs";
import { DocumentConstructorProps } from "../documents/document";
import { CustomDocConstructorProps } from "../documents/custom";

interface ResponseProps {
  httpResponse: any;
  documentType: string;
  input: Input;
  error: boolean;
}

type stringDict = { [index: string]: any };
type docConstructor = (
  params: DocumentConstructorProps | CustomDocConstructorProps
) => Document;

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

  protected formatResponse() {
    const constructor: docConstructor = this.getConstructor();
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
        constructor({
          apiPrediction: apiPage.prediction,
          inputFile: this.inputFile,
          documentType: this.documentType,
          pageId: apiPage.id,
          fullText: pageText,
        })
      );
    });
    this.document = constructor({
      apiPrediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
      documentType: this.documentType,
    });
  }

  protected getConstructor(): docConstructor {
    switch (this.documentType) {
      case DOC_TYPE_INVOICE: {
        return (params: DocumentConstructorProps) => new Invoice(params);
      }
      case DOC_TYPE_RECEIPT: {
        return (params: DocumentConstructorProps) => new Receipt(params);
      }
      case DOC_TYPE_FINANCIAL: {
        return (params: DocumentConstructorProps) =>
          new FinancialDocument(params);
      }
      case DOC_TYPE_PASSPORT: {
        return (params: DocumentConstructorProps) => new Passport(params);
      }
      default: {
        return (params: any) => new CustomDocument(params);
      }
    }
  }
}
