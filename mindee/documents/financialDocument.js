const Document = require("./document");
const Invoice = require("./invoice");
const Receipt = require("./receipt");
const Field = require("./fields").field;
const Date = require("./fields").date;
const Amount = require("./fields").amount;
const Locale = require("./fields").locale;
const Orientation = require("./fields").orientation;
const Tax = require("./fields").tax;

class FinancialDocument extends Document {
  /**
   *  @param {Object} apiPrediction - Json parsed prediction from HTTP response
   *  @param {Input} input - Input object
   *  @param {Integer} pageNumber - Page number for multi pages pdf input
   *  @param {Object} locale - locale value for creating FinancialDocument object from scratch
   *  @param {Object} totalIncl - total tax included value for creating FinancialDocument object from scratch
   *  @param {Object} totalExcl - total tax excluded value for creating FinancialDocument object from scratch
   *  @param {Object} Date - date value for creating FinancialDocument object from scratch
   *  @param {Object} InvoiceNumber - Invoice number value for creating FinancialDocument object from scratch
   *  @param {Object} taxes - taxes value for creating FinancialDocument object from scratch
   *  @param {Object} merchantName - merchant name value for creating FinancialDocument object from scratch
   *  @param {Object} paymentDetails - payment details value for creating FinancialDocument object from scratch
   *  @param {Object} companyNumber - company number value for creating FinancialDocument object from scratch
   *  @param {Object} vatNumber - vat number value for creating FinancialDocument object from scratch
   *  @param {Object} orientation - orientation value for creating FinancialDocument object from scratch
   *  @param {Object} totalTax - total tax value for creating FinancialDocument object from scratch
   *  @param {Object} time - time value for creating FinancialDocument object from scratch
   *  @param {Object} pageNumber - pageNumber for multi pages pdf input
   *  @param {String} level - specify whether object is built from "page" level or "document" level prediction
   */
  constructor({
    apiPrediction = undefined,
    inputFile = undefined,
    locale = undefined,
    totalIncl = undefined,
    totalExcl = undefined,
    date = undefined,
    invoiceNumber = undefined,
    dueDate = undefined,
    taxes = undefined,
    supplier = undefined,
    paymentDetails = undefined,
    companyNumber = undefined,
    vatNumber = undefined,
    orientation = undefined,
    totalTax = undefined,
    time = undefined,
    pageNumber = 0,
    level = "page",
  }) {
    super(inputFile);
    this.level = level;
    if (apiPrediction === undefined) {
      this.#initFromScratch({
        locale,
        totalIncl,
        totalExcl,
        date,
        invoiceNumber,
        dueDate,
        taxes,
        supplier,
        paymentDetails,
        companyNumber,
        vatNumber,
        orientation,
        pageNumber,
        totalTax,
        time,
      });
    } else {
      this.#initFromApiPrediction(apiPrediction, inputFile, pageNumber);
    }
    this.#checklist();
  }

  #initFromScratch({
    locale,
    totalIncl,
    totalExcl,
    totalTax,
    date,
    invoiceNumber,
    dueDate,
    taxes,
    paymentDetails,
    companyNumber,
    vatNumber,
    orientation,
    pageNumber,
    supplier,
    time,
  }) {
    const constructPrediction = function (item) {
      return { prediction: { value: item }, valueKey: "value", pageNumber };
    };
    this.locale = new Locale(constructPrediction(locale));
    this.totalIncl = new Amount(constructPrediction(totalIncl));
    this.totalExcl = new Amount(constructPrediction(totalExcl));
    this.totalTax = new Amount(constructPrediction(totalTax));
    this.date = new Date(constructPrediction(date));
    this.dueDate = new Date(constructPrediction(dueDate));
    this.supplier = new Field(constructPrediction(supplier));
    this.time = new Field(constructPrediction(time));
    this.orientation = new Orientation(constructPrediction(orientation));
    this.invoiceNumber = new Field(constructPrediction(invoiceNumber));
    this.paymentDetails = new Field(constructPrediction(paymentDetails));
    this.companyNumber = new Field(constructPrediction(companyNumber));
    this.vatNumber = new Field(constructPrediction(vatNumber));
    if (taxes !== undefined) {
      this.taxes = [];
      for (const t of taxes) {
        this.taxes.push(
          new Tax({
            prediction: { value: t[0], rate: t[1] },
            pageNumber,
            valueKey: "value",
            rateKey: "rate",
          })
        );
      }
    }
  }

  #initFromApiPrediction(apiPrediction, inputFile, pageNumber) {
    if (Object.keys(apiPrediction).includes("invoice_number")) {
      const invoice = new Invoice({
        apiPrediction,
        inputFile,
        pageNumber,
        level: this.level,
      });
      this.locale = invoice.locale;
      this.totalIncl = invoice.totalIncl;
      this.totalExcl = invoice.totalExcl;
      this.date = invoice.invoiceDate;
      this.invoiceNumber = invoice.invoiceNumber;
      this.dueDate = invoice.dueDate;
      this.taxes = invoice.taxes;
      this.supplier = invoice.supplier;
      this.paymentDetails = invoice.paymentDetails;
      this.companyNumber = invoice.companyNumber;
      this.orientation = invoice.orientation;
      this.totalTax = invoice.totalTax;
      this.time = new Field({
        prediction: { value: undefined, probability: 0.0 },
      });
    } else {
      const receipt = new Receipt({
        apiPrediction,
        inputFile,
        pageNumber,
        level: this.level,
      });
      this.orientation = receipt.orientation;
      this.date = receipt.date;
      this.dueDate = receipt.date;
      this.taxes = receipt.taxes;
      this.locale = receipt.locale;
      this.totalIncl = receipt.totalIncl;
      this.totalExcl = receipt.totalExcl;
      this.supplier = receipt.merchantName;
      this.time = receipt.time;
      this.totalTax = receipt.totalTax;
      this.invoiceNumber = new Field({
        prediction: { value: undefined, probability: 0.0 },
      });
      this.paymentDetails = new Field({
        prediction: { value: undefined, probability: 0.0 },
      });
      this.companyNumber = new Field({
        prediction: { value: undefined, probability: 0.0 },
      });
    }
  }

  toString() {
    return `
    -----Financial document-----
    Filename: ${this.filename}
    Total amount: ${this.totalIncl.value}
    Date: ${this.date.value}
    Supplier: ${this.supplier.value}
    Total taxes: ${this.totalTax.value}
    `;
  }

  #checklist() {
    this.checklist = {
      taxesMatchTotalIncl: this.#taxesMatchTotalIncl(),
    };
  }

  #taxesMatchTotalIncl() {
    // Check taxes and total include exist
    if (this.taxes.length === 0 || this.totalIncl.value === undefined)
      return false;

    // Reconstruct totalIncl from taxes
    let totalVat = 0;
    let reconstructedTotal = 0;
    this.taxes.forEach((tax) => {
      if (tax.value === undefined || !tax.rate) return false;
      totalVat += tax.value;
      reconstructedTotal += tax.value + (100 * tax.value) / tax.rate;
    });

    // Sanity check
    if (totalVat <= 0) return false;

    // Crate epsilon
    const eps = 1 / (100 * totalVat);

    if (
      this.totalIncl.value * (1 - eps) - 0.02 <= reconstructedTotal &&
      reconstructedTotal <= this.totalIncl.value * (1 + eps) + 0.02
    ) {
      this.taxes = this.taxes.map((tax) => ({ ...tax, probability: 1.0 }));
      this.totalTax.probability = 1.0;
      this.totalIncl.probability = 1.0;
      return true;
    }
    return false;
  }
}

module.exports = FinancialDocument;
