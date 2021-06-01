const APIObject = require("./object");
const Input = require("../inputs");

class APIInvoice extends APIObject {
  constructor(apiToken = undefined) {
    super(apiToken, "invoice");
    this.baseUrl = `${this.baseUrl}/invoices/`;
  }

  /**
   * @param {Boolean} includeWords: , extract all words into http_response
   * @param {Boolean} cutPdf: Automatically reconstruct pdf with more than 4 pages
   * @param {String} inputType: String in {'path', 'stream', 'base64'}
   * @param {String} file: Receipt filepath (allowed jpg, png, tiff, pdf)
   * @param {String} version: expense_receipt api version
   * @returns {Response} Wrapped response with Receipts objects parsed
   */
  async parse({
    input,
    inputType = "path",
    filename = undefined,
    version = "2",
    cutPdf = true,
    includeWords = false,
  }) {
    super.parse();
    const inputFile = new Input({ file: input, inputType, filename, cutPdf });
    await inputFile.init();
    const url = `v${version}/predict`;
    return await super._request(url, inputFile, includeWords);
  }

  /** 
    @param {String} inputFile - Input object
    @param {} response - HTTP response
    @param {Document} documentType - Document class in {"Receipt", "Invoice", "Financial_document"}
    @returns {Response}
  */
  wrapResponse(inputFile, response, documentType) {
    let result = super.wrapResponse(inputFile, response, documentType);
    result.documentType =
      result.httpResponse.data?.predictions?.[0]?.document_type?.value?.toLowerCase() ||
      result.documentType;
    return result;
  }
}

module.exports = APIInvoice;
