import {
  Document,
  Passport,
  Receipt,
  Invoice,
  FinancialDocument,
  CustomDocument,
  DocumentConstructorProps,
} from "../documents";
import { FullText } from "../fields";
import { Input } from "../inputs";

type stringDict = { [index: string]: any };

export interface ResponseProps {
  httpResponse: any;
  documentType: string;
  input: Input;
  error: boolean;
}

/**
 * Base class for all responses.
 */
export class Response<DocType extends Document> {
  httpResponse: any;
  readonly documentType: string;
  inputFile: Input;
  document?: DocType;
  pages: Array<DocType> = [];

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

/**
 * Class for all constructed (API Builder) endpoint responses.
 */
export class CustomResponse extends Response<CustomDocument> {
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

type StandardDocumentSig<DocType extends Document> = {
  new ({
    apiPrediction,
    inputFile,
    pageId,
    fullText,
  }: DocumentConstructorProps): DocType;
};

/**
 * Generic class for all standard (Off-the-Shelf) endpoint responses.
 */
export class StandardProductResponse<
  DocType extends Document
> extends Response<DocType> {
  documentClass: StandardDocumentSig<DocType>;

  constructor(
    documentClass: StandardDocumentSig<DocType>,
    params: ResponseProps
  ) {
    super(params);
    this.documentClass = documentClass;
    if (!params.error) {
      this.formatResponse();
    }
  }

  protected formatResponse() {
    const httpDataDocument = this.httpResponse.data.document;
    httpDataDocument.inference.pages.forEach((apiPage: stringDict) => {
      const pageText = this.getPageText(httpDataDocument, apiPage.id);
      this.pages.push(
        new this.documentClass({
          apiPrediction: apiPage.prediction,
          inputFile: this.inputFile,
          pageId: apiPage.id,
          fullText: pageText,
        })
      );
    });
    this.document = new this.documentClass({
      apiPrediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
    });
  }
}

export class InvoiceResponse extends StandardProductResponse<Invoice> {
  constructor(params: ResponseProps) {
    super(Invoice, params);
  }
}

export class ReceiptResponse extends StandardProductResponse<Receipt> {
  constructor(params: ResponseProps) {
    super(Receipt, params);
  }
}

export class FinancialDocResponse extends StandardProductResponse<FinancialDocument> {
  constructor(params: ResponseProps) {
    super(FinancialDocument, params);
  }
}

export class PassportResponse extends StandardProductResponse<Passport> {
  constructor(params: ResponseProps) {
    super(Passport, params);
  }
}
