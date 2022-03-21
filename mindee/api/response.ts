import { Receipt } from "@documents/receipt";
import { Invoice } from "@documents/invoice";
import { FinancialDocument } from "@documents/financialDocument";
import fs from "fs/promises";

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
    reconsctruted = false,
    ...args
  }: any) {
    this.httpResponse = httpResponse;
    this.documentType = documentType;
    this.input = input;
    if (!error && !reconsctruted) this.formatResponse();
    if (reconsctruted === true) {
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
    return new Response({ reconsctruted: true, ...args });
  }

  formatResponse() {
    const http_data_document = this.httpResponse.data.document;
    const constructors = {
      receipt: (params: any) => new Receipt(params),
      invoice: (params: any) => new Invoice(params),
      financialDocument: (params: any) => new FinancialDocument(params),
    };

    const predictions = http_data_document.inference.pages.entries();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[`${this.documentType}s`] = [];
    const document_words_content = [];

    // Create a list of Document (Receipt, Invoice...) for each page of the input document
    for (const [pageNumber, prediction] of predictions) {
      let page_words_content = [];
      if (
        "ocr" in http_data_document &&
        Object.keys(http_data_document.ocr).length > 0
      ) {
        page_words_content =
          http_data_document.ocr["mvision-v1"].pages[pageNumber].all_words;
        document_words_content.push(
          ...http_data_document.ocr["mvision-v1"].pages[pageNumber].all_words
        );
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[`${this.documentType}s`].push(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        constructors[this.documentType]({
          apiPrediction: prediction.prediction,
          inputFile: this.input,
          pageNumber: pageNumber,
          words: page_words_content,
        })
      );
    }

    // Merge the list of Document into a unique Document
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[this.documentType] = constructors[this.documentType]({
      apiPrediction: http_data_document.inference.prediction,
      inputFile: this.input,
      pageNumber: http_data_document.n_pages,
      level: "document",
      words: document_words_content,
    });
  }
}
