import { Receipt } from "../documents/receipt";
import { Invoice } from "../documents/invoice";
import { FinancialDocument } from "../documents/financialDocument";
import { promises as fs } from "fs";
import { CustomDocument } from "../documents/custom";
import { Passport } from "../documents";

interface ResponseInterface {
  httpResponse: any;
  documentType: string;
  input: any;
  dump(path: string): any;
  formatResponse(): void;
}

export class Response implements ResponseInterface {
  httpResponse: any;
  documentType: string;
  input: any;

  constructor({
    httpResponse,
    documentType,
    input,
    error,
    reconstructed = false,
    ...args
  }: any) {
    this.httpResponse = httpResponse;
    this.documentType = documentType;
    this.input = input;
    if (!error && !reconstructed) {
      this.formatResponse();
    }
    if (reconstructed === true) {
      Object.assign(this, args);
    }
  }

  async dump(path: string) {
    return await fs.writeFile(path, JSON.stringify(Object.entries(this)));
  }

  static async load(path: string) {
    const file = fs.readFile(path);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const args = JSON.parse(file);
    return new Response({ reconstructed: true, ...args });
  }

  formatResponse() {
    const httpDataDocument = this.httpResponse.data.document;
    const predictions = httpDataDocument.inference.pages.entries();
    const constructors = {
      receipt: (params: any) => new Receipt(params),
      invoice: (params: any) => new Invoice(params),
      financialDocument: (params: any) => new FinancialDocument(params),
      customDocument: (params: any) => new CustomDocument(params),
      passport: (params: any) => new Passport(params),
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[`${this.documentType}s`] = [];
    const documentWordsContent = [];

    // Create a list of Document (Receipt, Invoice...) for each page of the input document
    for (const [pageNumber, prediction] of predictions) {
      let pageWordsContent = [];
      if (
        "ocr" in httpDataDocument &&
        Object.keys(httpDataDocument.ocr).length > 0
      ) {
        pageWordsContent =
          httpDataDocument.ocr["mvision-v1"].pages[pageNumber].all_words;
        documentWordsContent.push(
          ...httpDataDocument.ocr["mvision-v1"].pages[pageNumber].all_words
        );
      }
      if (this.documentType in constructors) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[`${this.documentType}s`].push(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          constructors[this.documentType]({
            apiPrediction: prediction.prediction,
            inputFile: this.input,
            pageNumber: pageNumber,
            words: pageWordsContent,
            documentType: this.documentType,
          })
        );
        // Merge the list of Document into a unique Document
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[this.documentType] = constructors[this.documentType]({
          apiPrediction: httpDataDocument.inference.prediction,
          inputFile: this.input,
          pageNumber: httpDataDocument.n_pages,
          level: "document",
          words: documentWordsContent,
          documentType: this.documentType,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[`${this.documentType}s`].push(
          constructors["customDocument"]({
            inputFile: this.input,
            prediction: prediction.prediction,
            pageId: pageNumber,
            documentType: this.documentType,
          })
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[this.documentType] = constructors["customDocument"]({
          inputFile: this.input,
          prediction: httpDataDocument.inference.prediction,
          pageId: pageNumber,
          documentType: this.documentType,
        });
      }
    }
  }
}
