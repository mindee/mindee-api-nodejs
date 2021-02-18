const APIObject = require("./object");
const Input = require("../inputs");

class APIFinancialDocument extends APIObject {
  constructor(invoiceToken, receiptToken) {
    super(undefined, "financialDocument");
    this.invoiceToken = invoiceToken;
    this.receiptToken = receiptToken;
  }

  /**
   * @param {String} file: Receipt filepath (allowed jpg, png, tiff, pdf)
   * @param {String} inputType: String in {'path', 'stream', 'base64'}
   * @param {Boolean} includeWords: extract all words into http_response
   * @param {String} version: expense_receipt api version
   * @param {Boolean} cutPdf: Automatically reconstruct pdf with more than 4 pages
   * @returns {Response} Wrapped response with Receipts objects parsed
   */
  async parse({
    input,
    inputType = "path",
    filename = undefined,
    version = "3",
    cutPdf = true,
    includeWords = false,
  }) {
    const inputFile = new Input({ file: input, inputType, filename, cutPdf });
    this.apiToken =
      inputFile.fileExtension === "pdf" ? this.invoiceToken : this.receiptToken;
    await inputFile.init();
    const url =
      inputFile.fileExtension === "pdf"
        ? "/invoices/v1/predict"
        : "/expense_receipts/v3/predict";
    super.parse();
    return await super._request(url, inputFile, version, includeWords);
  }
}

module.exports = APIFinancialDocument;
