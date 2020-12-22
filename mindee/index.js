const errorHandler = require("./errors/handler");
const logger = require("./logger");
const APIReceipt = require("./api/receipt");
class Client {
  constructor(
    receiptToken = undefined,
    invoiceToken = undefined,
    throwOnError = true,
    debug = undefined
  ) {
    this.receiptToken = receiptToken || process.env.MINDEE_RECEIPT_TOKEN;
    this.invoiceToken = invoiceToken || process.env.MINDEE_INVOICE_TOKEN;
    errorHandler.throwOnError = throwOnError;
    logger.level = debug ?? process.env.MINDEE_DEBUG ? "debug" : "warn";
    this.receipt = new APIReceipt(this.receiptToken);
  }
}

exports.Client = Client;
exports.api = require("./api");
exports.inputs = require("./inputs");
exports.documents = require("./documents");
