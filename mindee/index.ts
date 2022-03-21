import "module-alias/register";

import { errorHandler } from "@errors/handler";
const { logger, LOG_LEVELS } = require("./logger");

import { APIReceipt } from "@api/receipt";
import { APIInvoice } from "@api/invoice";

import { APIFinancialDocument } from "@mindee/api/financialDocument";

interface constructorObject {
  receiptToken: string;
  invoiceToken: string;
  throwOnError: boolean;
  debug: boolean;
}

class Client {
  /**
   * @param {string} receiptToken - Receipt Expense Token from Mindee dashboard
   * @param {string} invoiceToken - Invoice Token from Mindee dashboard
   * @param {boolean} throwOnError - Throw if an error is send from the API / SDK (true by default)
   * @param {boolean} debug - Enable debug logging (disable by default)
   */
  private readonly receiptToken: string | undefined;
  private readonly invoiceToken: string | undefined;
  readonly receipt: APIReceipt;
  readonly invoice: APIInvoice;
  readonly financialDocument: APIFinancialDocument;

  constructor({
    receiptToken,
    invoiceToken,
    throwOnError = true,
    debug,
  }: constructorObject) {
    this.receiptToken = receiptToken || process.env.MINDEE_RECEIPT_TOKEN;
    this.invoiceToken = invoiceToken || process.env.MINDEE_INVOICE_TOKEN;
    errorHandler.throwOnError = throwOnError;
    logger.level =
      debug ?? process.env.MINDEE_DEBUG
        ? LOG_LEVELS["debug"]
        : LOG_LEVELS["warn"];
    this.receipt = new APIReceipt(this.receiptToken);
    this.invoice = new APIInvoice(this.invoiceToken);
    this.financialDocument = new APIFinancialDocument(
      this.invoiceToken as string,
      this.receiptToken as string
    );
  }
}

module.exports = Client;
exports.documents = require("./documents");
exports.api = require("./api");
exports.inputs = require("./inputs");
