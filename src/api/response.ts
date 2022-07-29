import {
  Document,
  Passport,
  Receipt,
  Invoice,
  FinancialDocument,
  CustomDocument,
} from "../documents";
import { FullText } from "../fields";
import { Input } from "../inputs";

export interface ResponseProps {
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
  document?: Document;

  constructor(params: ResponseProps) {
    this.httpResponse = params.httpResponse;
    this.documentType = params.documentType;
    this.inputFile = params.input;
  }

  protected getPageText(httpDataDocument: any, pageId: number): FullText {
    const pageText = new FullText();
    if (
      "ocr" in httpDataDocument &&
      Object.keys(httpDataDocument.ocr).length > 0
    ) {
      pageText.words =
        httpDataDocument.ocr["mvision-v1"].pages[pageId].all_words;
    }
    return pageText;
  }
}

export class InvoiceResponse extends Response {
  pages: Array<Invoice> = [];
  document?: Invoice;

  constructor(params: ResponseProps) {
    super(params);
    if (!params.error) {
      this.formatResponse();
    }
  }

  protected formatResponse() {
    const httpDataDocument = this.httpResponse.data.document;
    httpDataDocument.inference.pages.forEach((apiPage: stringDict) => {
      const pageText = this.getPageText(httpDataDocument, apiPage.id);
      this.pages.push(
        new Invoice({
          apiPrediction: apiPage.prediction,
          inputFile: this.inputFile,
          pageId: apiPage.id,
          fullText: pageText,
        })
      );
    });
    this.document = new Invoice({
      apiPrediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
    });
  }
}

export class ReceiptResponse extends Response {
  pages: Array<Receipt> = [];
  document?: Receipt;

  constructor(params: ResponseProps) {
    super(params);
    if (!params.error) {
      this.formatResponse();
    }
  }

  protected formatResponse() {
    const httpDataDocument = this.httpResponse.data.document;
    httpDataDocument.inference.pages.forEach((apiPage: stringDict) => {
      const pageText = this.getPageText(httpDataDocument, apiPage.id);
      this.pages.push(
        new Receipt({
          apiPrediction: apiPage.prediction,
          inputFile: this.inputFile,
          pageId: apiPage.id,
          fullText: pageText,
        })
      );
    });
    this.document = new Receipt({
      apiPrediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
    });
  }
}

export class FinancialResponse extends Response {
  pages: Array<FinancialDocument> = [];
  document?: FinancialDocument;

  constructor(params: ResponseProps) {
    super(params);
    if (!params.error) {
      this.formatResponse();
    }
  }

  protected formatResponse() {
    const httpDataDocument = this.httpResponse.data.document;
    httpDataDocument.inference.pages.forEach((apiPage: stringDict) => {
      const pageText = this.getPageText(httpDataDocument, apiPage.id);
      this.pages.push(
        new FinancialDocument({
          apiPrediction: apiPage.prediction,
          inputFile: this.inputFile,
          pageId: apiPage.id,
          fullText: pageText,
        })
      );
    });
    this.document = new FinancialDocument({
      apiPrediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
    });
  }
}

export class PassportResponse extends Response {
  pages: Array<Passport> = [];
  document?: Passport;

  constructor(params: ResponseProps) {
    super(params);
    if (!params.error) {
      this.formatResponse();
    }
  }

  protected formatResponse() {
    const httpDataDocument = this.httpResponse.data.document;
    httpDataDocument.inference.pages.forEach((apiPage: stringDict) => {
      const pageText = this.getPageText(httpDataDocument, apiPage.id);
      this.pages.push(
        new Passport({
          apiPrediction: apiPage.prediction,
          inputFile: this.inputFile,
          pageId: apiPage.id,
          fullText: pageText,
        })
      );
    });
    this.document = new Passport({
      apiPrediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
    });
  }
}

export class CustomResponse extends Response {
  pages: Array<CustomDocument> = [];
  document?: CustomDocument;

  constructor(params: ResponseProps) {
    super(params);
    if (!params.error) {
      this.formatResponse();
    }
  }

  protected formatResponse() {
    const httpDataDocument = this.httpResponse.data.document;
    httpDataDocument.inference.pages.forEach((apiPage: stringDict) => {
      this.pages.push(
        new CustomDocument({
          apiPrediction: apiPage.prediction,
          inputFile: this.inputFile,
          pageId: apiPage.id,
          documentType: this.documentType,
        })
      );
    });
    this.document = new CustomDocument({
      apiPrediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
      documentType: this.documentType,
    });
  }
}
