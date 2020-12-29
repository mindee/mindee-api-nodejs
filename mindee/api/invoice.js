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
  async parse(
    file,
    inputType = "path",
    version = "2",
    cutPdf = true,
    includeWords = true
  ) {
    super.parse();
    const inputFile = new Input({ file, inputType, cutPdf });
    await inputFile.init();
    const url = `v${version}/predict`;
    return await super._request(url, inputFile, version, includeWords);
  }
}

module.exports = APIInvoice;
