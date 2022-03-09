const Receipt = require("../documents").receipt;
const Invoice = require("../documents").invoice;
const FinancialDocument = require("../documents").financialDocument;
const fs = require("fs").promises;

class Response {
  constructor({
    httpResponse,
    documentType,
    input,
    error,
    reconsctruted = false,
    ...args
  }) {
    this.httpResponse = httpResponse;
    this.documentType = documentType;
    this.input = input;
    if (!error && !reconsctruted) this.formatResponse();
    if (reconsctruted === true) {
      Object.assign(this, args);
    }
  }

  async dump(path) {
    return await fs.writeFile(path, JSON.stringify(Object.entries(this)));
  }

  static async load(path) {
    const file = fs.readFile(path);
    const args = JSON.parse(file);
    return new Response({ reconsctruted: true, ...args });
  }

  formatResponse() {
    let http_data_document = this.httpResponse.data.document;
    const constructors = {
      receipt: (params) => new Receipt(params),
      invoice: (params) => new Invoice(params),
      financialDocument: (params) => new FinancialDocument(params),
    };

    const predictions = http_data_document.inference.pages.entries();
    this[`${this.documentType}s`] = [];
    let document_words_content = [];

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
      this[`${this.documentType}s`].push(
        constructors[this.documentType]({
          apiPrediction: prediction.prediction,
          inputFile: this.input,
          pageNumber: pageNumber,
          words: page_words_content,
        })
      );
    }

    // Merge the list of Document into a unique Document
    this[this.documentType] = constructors[this.documentType]({
      apiPrediction: http_data_document.inference.prediction,
      inputFile: this.input,
      pageNumber: http_data_document.n_pages,
      level: "document",
      words: document_words_content,
    });
  }
}

module.exports = Response;
