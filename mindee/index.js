const ErrorHandler = require("./error");
const Logger = require("./logger");

class Client {
  constructor(
    receiptToken = undefined,
    invoiceToken = undefined,
    throwOnError = true,
    debug = undefined
  ) {
    this.receiptToken = receiptToken || process.env.MINDEE_RECEIPT_TOKEN;
    this.invoiceToken = invoiceToken || process.env.MINDEE_INVOICE_TOKEN;
    this.errorHandler = new ErrorHandler(throwOnError);
    this.logger = new Logger(
      debug ?? process.env.MINDEE_DEBUG ? "debug" : "warn"
    );
  }
}

module.exports = { Client: Client };
