import { Document, DocumentSig } from "../documents";
import { FullText } from "../fields";
import { InputSource } from "../inputs";

type stringDict = { [index: string]: any };

export interface ResponseProps {
  httpResponse: any;
  documentType?: string;
  input: InputSource;
  error: boolean;
}

/**
 * Base class for all responses.
 */
export class Response<DocType extends Document> {
  httpResponse: any;
  inputFile: InputSource;
  document?: DocType;
  pages: Array<DocType> = [];
  readonly documentClass: DocumentSig<DocType>;

  constructor(documentClass: DocumentSig<DocType>, params: ResponseProps) {
    this.documentClass = documentClass;
    this.httpResponse = params.httpResponse;
    this.inputFile = params.input;
    if (!params.error) {
      this.formatResponse(params.documentType);
    }
  }

  protected formatResponse(documentType?: string) {
    const httpDataDocument = this.httpResponse.data.document;
    httpDataDocument.inference.pages.forEach((apiPage: stringDict) => {
      const pageText = this.getPageText(httpDataDocument, apiPage.id);
      this.pages.push(
        new this.documentClass({
          documentType: documentType,
          prediction: apiPage.prediction,
          inputSource: this.inputFile,
          pageId: apiPage.id,
          orientation: apiPage.orientation,
          extras: apiPage.extras,
          fullText: pageText,
        })
      );
    });
    this.document = new this.documentClass({
      documentType: documentType,
      prediction: httpDataDocument.inference.prediction,
      inputSource: this.inputFile,
      orientation: {},
      extras: {},
    });
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
