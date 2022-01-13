const Document = require("../documents").document;
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
    const constructors = {
      receipt: (params) => new Receipt(params),
      invoice: (params) => new Invoice(params),
      financialDocument: (params) => new FinancialDocument(params),
    };
    const predictions = this.httpResponse.data.document.inference.pages.entries();
    this[`${this.documentType}s`] = [];

    // Create a list of Document (Receipt, Invoice...) for each page of the input document
    for (const [pageNumber, prediction] of predictions) {
      this[`${this.documentType}s`].push(
        constructors[this.documentType]({
          apiPrediction: prediction.prediction,
          inputFile: this.input,
          pageNumber: pageNumber,
        })
      );
    }

    // Merge the list of Document into a unique Document
    this[this.documentType] = constructors[this.documentType]({
      apiPrediction: this.httpResponse.data.document.inference.prediction,
      inputFile: this.input,
      pageNumber: -1,
      level: "document",
    });
  }
}

module.exports = Response;
