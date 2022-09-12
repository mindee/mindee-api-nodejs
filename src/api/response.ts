import {
  Document,
  Passport,
  Receipt,
  Invoice,
  FinancialDocument,
  CustomDocument,
  DocumentConstructorProps,
  Cropper,
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
          prediction: apiPage.prediction,
          orientation: apiPage.orientation,
          extras: apiPage.extras,
          inputFile: this.inputFile,
          pageId: apiPage.id,
          documentType: this.documentType,
        })
      );
    });
    this.document = new CustomDocument({
      prediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
      documentType: this.documentType,
      orientation: {},
      extras: {},
    });
  }
}

type StandardDocumentSig<DocType extends Document> = {
  new ({
    prediction,
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
          prediction: apiPage.prediction,
          inputFile: this.inputFile,
          pageId: apiPage.id,
          orientation: apiPage.orientation,
          extras: apiPage.extras,
          fullText: pageText,
        })
      );
    });
    this.document = new this.documentClass({
      prediction: httpDataDocument.inference.prediction,
      inputFile: this.inputFile,
      orientation: {},
      extras: {},
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

export class CropperResponse extends StandardProductResponse<Cropper> {
  constructor(params: ResponseProps) {
    super(Cropper, params);
  }
}
