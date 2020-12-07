const ErrorHandler = require("./error");
const Logger = require("./logger");

class Client {
  constructor(
    receipt_token = undefined,
    invoice_token = undefined,
    throw_on_error = true,
    debug = undefined
  ) {
    this.receipt_token = receipt_token || process.env.MINDEE_RECEIPT_TOKEN;
    this.invoice_token = invoice_token || process.env.MINDEE_INVOICE_TOKEN;
    this.error_handler = ErrorHandler(throw_on_error);
    this.logger = Logger(debug ?? process.env.MINDEE_DEBUG ? 'debug' : 'warn');
  }
}

module.exports = {
  Client,
};
