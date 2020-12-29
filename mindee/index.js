const errorHandler = require("./errors/handler");
const logger = require("./logger");
const APIReceipt = require("./api/receipt");
const APIInvoice = require("./api/invoice");
class Client {
  constructor({
    receiptToken = undefined,
    invoiceToken = undefined,
    throwOnError = true,
    debug = undefined,
  } = {}) {
    this.receiptToken = receiptToken || process.env.MINDEE_RECEIPT_TOKEN;
    this.invoiceToken = invoiceToken || process.env.MINDEE_INVOICE_TOKEN;
    errorHandler.throwOnError = throwOnError;
    logger.level = debug ?? process.env.MINDEE_DEBUG ? "debug" : "warn";
    this.receipt = new APIReceipt(this.receiptToken);
    this.invoice = new APIInvoice(this.invoiceToken);
  }
}

exports.Client = Client;
exports.documents = require("./documents");
exports.api = require("./api");
exports.inputs = require("./inputs");
