const APIObject = require("./object");
const Input = require("../inputs");

class APIReceipt extends APIObject {
  constructor(apiToken = undefined) {
    super(apiToken, "receipt");
    this.baseUrl = `${this.baseUrl}/expense_receipts/`;
  }

  /**
   * @param {String} file: Receipt filepath (allowed jpg, png, tiff, pdf)
   * @param {String} inputType: String in {'path', 'stream', 'base64'}
   * @param {Boolean} includeWords: extract all words into http_response
   * @param {String} version: expense_receipt api version
   * @param {Boolean} cutPdf: Automatically reconstruct pdf with more than 4 pages
   * @returns {Response} Wrapped response with Receipts objects parsed
   */
  async parse(
    file,
    inputType = "path",
    version = "3",
    cutPdf = true,
    includeWords = false
  ) {
    super.parse();
    const inputFile = new Input({ file, inputType, cutPdf });
    await inputFile.init();
    const url = `v${version}/predict`;

    return await super._request(url, inputFile, version, includeWords);
  }
}

module.exports = APIReceipt;
