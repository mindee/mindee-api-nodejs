import {
  Document,
  PassportV1,
  ReceiptV3,
  InvoiceV3,
  FinancialDocumentV1,
  CustomDocument,
  DocumentConstructorProps,
  CropperV1,
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

// Should be an easier way of doing this
// Could look into a factory method
// Could also try to eliminate the need to pass this to `parse` and instead pass only the Document

export class InvoiceV3Response extends StandardProductResponse<InvoiceV3> {
  constructor(params: ResponseProps) {
    super(InvoiceV3, params);
  }
}

export class ReceiptV3Response extends StandardProductResponse<ReceiptV3> {
  constructor(params: ResponseProps) {
    super(ReceiptV3, params);
  }
}

export class ReceiptV4Response extends StandardProductResponse<ReceiptV3> {
  constructor(params: ResponseProps) {
    super(ReceiptV3, params);
  }
}

export class FinancialDocV1Response extends StandardProductResponse<FinancialDocumentV1> {
  constructor(params: ResponseProps) {
    super(FinancialDocumentV1, params);
  }
}

export class PassportV1Response extends StandardProductResponse<PassportV1> {
  constructor(params: ResponseProps) {
    super(PassportV1, params);
  }
}

export class CropperV1Response extends StandardProductResponse<CropperV1> {
  constructor(params: ResponseProps) {
    super(CropperV1, params);
  }
}
