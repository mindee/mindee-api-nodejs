const Document = require("./document");
const Invoice = require("./invoice");
const Receipt = require("./receipt");
const Field = require("./fields").field;
const Date = require("./fields").date;
const Amount = require("./fields").amount;
const Locale = require("./fields").locale;
const Orientation = require("./fields").orientation;
const PaymentDetails = require("./fields").paymentDetails;
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
    merchantName = undefined,
    paymentDetails = undefined,
    companyNumber = undefined,
    vatNumber = undefined,
    orientation = undefined,
    totalTax = undefined,
    time = undefined,
    pageNumber = 0,
  }) {
    super(inputFile);
    if (apiPrediction === undefined) {
      this.#initFromScratch({
        locale,
        totalIncl,
        totalExcl,
        date,
        invoiceNumber,
        dueDate,
        taxes,
        merchantName,
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
    merchantName,
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
    this.merchantName = new Field(constructPrediction(merchantName));
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
    if ("invoiceNumber" in Object.keys(apiPrediction)) {
      const invoice = Invoice(apiPrediction, inputFile, pageNumber);
      Object.assign(this, invoice);
      this.time = Field({ value: undefined, probability: 0.0 });
      this.merchantName = Field({ value: undefined, probability: 0.0 });
    } else {
      const receipt = Receipt(apiPrediction, inputFile, pageNumber);
      Object.assign(this, receipt);
      this.invoiceNumber = Field({ value: undefined, probability: 0.0 });
      this.paymentDetails = Field({ value: undefined, probability: 0.0 });
      this.companyNumber = Field({ value: undefined, probability: 0.0 });
    }
  }

  toString() {
    return `
    -----Financial document-----
    Filename: ${this.filename}
    Total amount: ${this.totalIncl.value}
    Date: ${this.date.value}
    Merchant name: ${this.merchantName.value}
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
