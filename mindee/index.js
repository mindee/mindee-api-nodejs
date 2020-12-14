const errorHandler = require("./errors/handler");
const logger = require("./logger");

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
  }
}

module.exports = { Client: Client };
