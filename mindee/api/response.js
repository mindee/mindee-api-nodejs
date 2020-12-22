const Document = require("../documents").document;
const Receipt = require("../documents").receipt;

class Response {
  constructor({ httpResponse, documentType, input }) {
    this.httpResponse = httpResponse;
    this.documentType = documentType;
    this.input = input;
    this.formatResponse();
  }

  dump(_path) {
    //TODO dump as json object
  }

  static load(_path) {
    //TODO load from json object
    // pages, document,
  }

  formatResponse() {
    const constructors = {
      receipt: (params) => new Receipt(params),
      //invoice: (params) => new Invoice(params),
      //financialDocument: (params) => new FinancialDocument(params),
    };
    const predictions = this.httpResponse.data.predictions.entries();
    this[`${this.documentType}s`] = [];
    console.log(this.documentType);

    // Create a list of Document (Receipt, Invoice...) for each page of the input document
    for (const [pageNumber, prediction] of predictions) {
      this[`${this.documentType}s`].push(
        constructors[this.documentType]({
          apiPrediction: prediction,
          input: this.input,
          pageNumber: pageNumber,
        })
      );
    }

    // Merge the list of Document into a unique Document
    this[this.documentType] = Document.mergePages(
      this[`${this.documentType}s`]
    );
  }
}

module.exports = Response;
