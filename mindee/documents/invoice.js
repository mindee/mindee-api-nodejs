const Document = require("./document");
const Field = require("./fields").field;
const Date = require("./fields").date;
const Amount = require("./fields").amount;
const Locale = require("./fields").locale;
const Orientation = require("./fields").orientation;
const PaymentDetails = require("./fields").paymentDetails;
const Tax = require("./fields").tax;

class Invoice extends Document {
  /**
   *  @param {Object} apiPrediction - Json parsed prediction from HTTP response
   *  @param {Input} input - Input object
   *  @param {Object} locale - locale value for creating Invoice object from scratch
   *  @param {Object} totalIncl - total tax included value for creating Invoice object from scratch
   *  @param {Object} totalExcl - total tax excluded value for creating Invoice object from scratch
   *  @param {Object} invoiceDate - invoice date value for creating Invoice object from scratch
   *  @param {Object} invoiceNumber - invoice number value for creating Invoice object from scratch
   *  @param {Object} taxes - taxes value for creating Invoice object from scratch
   *  @param {Object} supplier - supplier value for creating Invoice object from scratch
   *  @param {Object} supplierAddress - supplier address value for creating Invoice object from scratch
   *  @param {Object} paymentDetails - payment details value for creating Invoice object from scratch
   *  @param {Object} companyNumber - company number value for creating Invoice object from scratch
   *  @param {Object} vatNumber - vat number value for creating Invoice object from scratch
   *  @param {Object} orientation - orientation value for creating Invoice object from scratch
   *  @param {Object} totalTax - total tax value for creating Invoice object from scratch
   *  @param {Object} customerName - customer name value for creating Invoice object from scratch
   *  @param {Object} customerAddress - customer address value for creating Invoice object from scratch
   *  @param {Object} customerCompanyRegistration - customer company registration value for creating Invoice object from scratch
   *  @param {Number} pageNumber - pageNumber for multi pages pdf input
   *  @param {String} level - specify whether object is built from "page" level or "document" level prediction
   */
  constructor({
    apiPrediction = undefined,
    inputFile = undefined,
    locale = undefined,
    totalIncl = undefined,
    totalExcl = undefined,
    invoiceDate = undefined,
    invoiceNumber = undefined,
    dueDate = undefined,
    taxes = undefined,
    supplier = undefined,
    supplierAddress = undefined,
    paymentDetails = undefined,
    companyNumber = undefined,
    vatNumber = undefined,
    orientation = undefined,
    totalTax = undefined,
    customerName = undefined,
    customerAddress = undefined,
    customerCompanyRegistration = undefined,
    words = undefined,
    pageNumber = 0,
    level = "page",
  }) {
    super(inputFile);
    this.level = level;
    this.constructPrediction = function (item) {
      return { prediction: { value: item }, valueKey: "value", pageNumber };
    };
    if (apiPrediction === undefined) {
      this.#initFromScratch({
        locale,
        totalIncl,
        totalExcl,
        invoiceDate,
        invoiceNumber,
        dueDate,
        taxes,
        supplier,
        supplierAddress,
        paymentDetails,
        companyNumber,
        vatNumber,
        orientation,
        pageNumber,
        totalTax,
        customerName,
        customerAddress,
        customerCompanyRegistration,
      });
    } else {
      this.#initFromApiPrediction(apiPrediction, pageNumber, words);
    }
    this.#checklist();
    this.#reconstruct();
  }

  #initFromScratch({
    locale,
    totalIncl,
    totalExcl,
    totalTax,
    invoiceDate,
    invoiceNumber,
    dueDate,
    taxes,
    supplier,
    supplierAddress,
    paymentDetails,
    companyNumber,
    vatNumber,
    orientation,
    pageNumber,
    customerName,
    customerAddress,
    customerCompanyRegistration,
  }) {
    this.locale = new Locale(this.constructPrediction(locale));
    this.totalIncl = new Amount(this.constructPrediction(totalIncl));
    this.totalExcl = new Amount(this.constructPrediction(totalExcl));
    this.totalTax = new Amount(this.constructPrediction(totalTax));
    this.date = new Date(this.constructPrediction(invoiceDate));
    this.invoiceDate = new Date(this.constructPrediction(invoiceDate));
    this.dueDate = new Date(this.constructPrediction(dueDate));
    this.supplier = new Field(this.constructPrediction(supplier));
    this.supplierAddress = new Field(this.constructPrediction(supplierAddress));
    this.invoiceNumber = new Field(this.constructPrediction(invoiceNumber));
    this.paymentDetails = new Field(this.constructPrediction(paymentDetails));
    this.companyNumber = new Field(this.constructPrediction(companyNumber));
    this.vatNumber = new Field(this.constructPrediction(vatNumber));
    this.customerName = new Field(this.constructPrediction(customerName));
    this.customerAddress = new Field(this.constructPrediction(customerAddress));
    this.customerCompanyRegistration = new Field(
      this.constructPrediction(customerCompanyRegistration)
    );
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
    if (this.level === "page") {
      this.orientation = new Orientation(this.constructPrediction(orientation));
    }
  }

  #initFromApiPrediction(apiPrediction, pageNumber, words) {
    this.locale = new Locale({ prediction: apiPrediction.locale, pageNumber });
    this.totalIncl = new Amount({
      prediction: apiPrediction.total_incl,
      valueKey: "value",
      pageNumber,
    });
    this.totalTax = new Amount({
      prediction: { value: undefined, confidence: 0.0 },
      valueKey: "value",
      pageNumber,
    });
    this.totalExcl = new Amount({
      prediction: apiPrediction.total_excl,
      valueKey: "value",
      pageNumber,
    });
    this.date = new Date({
      prediction: apiPrediction.date,
      valueKey: "value",
      pageNumber,
    });
    this.invoiceDate = new Date({
      prediction: apiPrediction.date,
      valueKey: "value",
      pageNumber,
    });
    this.taxes = apiPrediction.taxes.map(function (taxPrediction) {
      return new Tax({
        prediction: taxPrediction,
        pageNumber,
        valueKey: "value",
        rateKey: "rate",
        codeKey: "code",
      });
    });
    this.companyNumber = apiPrediction.company_registration.map(function (
      companyNumber
    ) {
      return new Field({
        prediction: companyNumber,
        pageNumber,
        extraFields: ["type"],
      });
    });
    this.dueDate = new Date({
      prediction: apiPrediction.due_date,
      valueKey: "value",
      pageNumber,
    });
    this.invoiceNumber = new Field({
      prediction: apiPrediction.invoice_number,
      pageNumber,
    });
    this.supplier = new Field({
      prediction: apiPrediction.supplier,
      pageNumber,
    });
    this.supplierAddress = new Field({
      prediction: apiPrediction.supplier_address,
      pageNumber,
    });
    this.customerName = new Field({
      prediction: apiPrediction.customer,
      pageNumber,
    });
    this.customerAddress = new Field({
      prediction: apiPrediction.customer_address,
      pageNumber,
    });
    this.customerCompanyRegistration = apiPrediction.customer_company_registration.map(
      function (customerCompanyRegistration) {
        return new Field({
          prediction: customerCompanyRegistration,
          pageNumber,
          extraFields: ["type"],
        });
      }
    );
    this.paymentDetails = apiPrediction.payment_details.map(function (
      paymentDetail
    ) {
      return new PaymentDetails({ prediction: paymentDetail, pageNumber });
    });
    if (this.level === "page") {
      this.orientation = new Orientation({
        prediction: apiPrediction.orientation,
        pageNumber,
      });
    } else {
      this.orientation = new Orientation(
        this.constructPrediction({
          prediction: {
            value: undefined,
            confidence: 0.0,
            degrees: undefined,
          },
        })
      );
    }
    if (words && words.length > 0) this.words = words;
  }

  toString() {
    return `
    -----Invoice data-----
    Filename: ${this.filename}
    Invoice number: ${this.invoiceNumber.value}
    Total amount including taxes: ${this.totalIncl.value}
    Total amount excluding taxes: ${this.totalExcl.value}
    Invoice Date: ${this.invoiceDate.value}
    Supplier name: ${this.supplier.value}
    Supplier address: ${this.supplierAddress.value}
    Customer name: ${this.customerName.value}
    Customer address: ${this.customerAddress.value}
    Taxes: ${this.taxes.map((tax) => tax.toString()).join(" - ")}
    Total taxes: ${this.totalTax.value}
    `;
  }

  #checklist() {
    this.checklist = {
      taxesMatchTotalIncl: this.#taxesMatchTotalIncl(),
      taxesMatchTotalExcl: this.#taxesMatchTotalExcl(),
      taxesPlusTotalExclMatchTotalIncl: this.#taxesPlusTotalExclMatchTotalIncl(),
    };
  }

  #reconstruct() {
    this.#reconstructTotalTax();
    this.#reconstructTotalExcl();
    this.#reconstructTotalIncl();
    this.#reconstructTotalTaxFromTotals();
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

  /**
   *
   */
  #taxesMatchTotalExcl() {
    // Check taxes and total amount exist
    if (this.taxes.length === 0 || this.totalExcl.value == null) return false;

    // Reconstruct total_incl from taxes
    let totalVat = 0;
    let reconstructedTotal = 0;
    this.taxes.forEach((tax) => {
      if (tax.value == null || !tax.rate) return false;
      totalVat += tax.value;
      reconstructedTotal += (100 * tax.value) / tax.rate;
    });

    // Sanity check
    if (totalVat <= 0) return false;

    // Crate epsilon
    const eps = 1 / (100 * totalVat);

    if (
      this.totalExcl.value * (1 - eps) - 0.02 <= reconstructedTotal &&
      reconstructedTotal <= this.totalExcl.value * (1 + eps) + 0.02
    ) {
      this.taxes = this.taxes.map((tax) => ({ ...tax, probability: 1.0 }));
      this.totalTax.probability = 1.0;
      this.totalExcl.probability = 1.0;
      return true;
    }
    return false;
  }

  #taxesPlusTotalExclMatchTotalIncl() {
    if (
      this.totalExcl.value === undefined ||
      this.taxes.length == 0 ||
      this.totalIncl === undefined
    )
      return false;
    let totalVat = 0;
    this.taxes.forEach((tax) => (totalVat += tax.value));
    const reconstructedTotal = totalVat + this.totalExcl.value;

    if (totalVat <= 0) return false;

    if (
      this.totalIncl.value - 0.01 <= reconstructedTotal &&
      reconstructedTotal <= this.totalIncl.value + 0.01
    ) {
      this.taxes = this.taxes.map((tax) => ({ ...tax, probability: 1.0 }));
      this.totalTax.probability = 1.0;
      this.totalIncl.probability = 1.0;
      return true;
    }
    return false;
  }

  #reconstructTotalTax() {
    if (this.taxes.length > 0) {
      const totalTax = {
        value: this.taxes.reduce((acc, tax) => {
          return tax.value !== undefined ? acc + tax.value : acc;
        }, 0),
        confidence: Field.arrayProbability(this.taxes),
      };
      if (totalTax.value > 0)
        this.totalTax = new Amount({
          prediction: totalTax,
          valueKey: "value",
          reconstructed: true,
        });
    }
  }

  #reconstructTotalTaxFromTotals() {
    if (
      this.totalTax.value === undefined &&
      this.totalIncl.value > 0 &&
      this.totalExcl.value > 0 &&
      this.totalExcl.value <= this.totalIncl.value
    ) {
      const totalTax = {
        value: this.totalIncl.value - this.totalExcl.value,
        confidence: this.totalIncl.probability * this.totalExcl.probability,
      };
      if (totalTax.value > 0)
        this.totalTax = new Amount({
          prediction: totalTax,
          valueKey: "value",
          reconstructed: true,
        });
    }
  }

  #reconstructTotalExcl() {
    if (
      this.taxes.length &&
      this.totalIncl.value != null &&
      this.totalExcl.value === undefined
    ) {
      const totalExcl = {
        value:
          this.totalIncl.value -
          this.taxes.reduce((acc, tax) => {
            return tax.value !== undefined ? acc + tax.value : acc;
          }, 0),
        confidence:
          Field.arrayProbability(this.taxes) * this.totalIncl.probability,
      };
      this.totalExcl = new Amount({
        prediction: totalExcl,
        valueKey: "value",
        reconstructed: true,
      });
    }
  }

  #reconstructTotalIncl() {
    if (
      this.taxes.length &&
      this.totalExcl.value != null &&
      this.totalIncl.value === undefined
    ) {
      const totalIncl = {
        value:
          this.totalExcl.value +
          this.taxes.reduce((acc, tax) => {
            return tax.value ? acc + tax.value : acc;
          }, 0.0),
        confidence:
          Field.arrayProbability(this.taxes) * this.totalExcl.probability,
      };
      this.totalIncl = new Amount({
        prediction: totalIncl,
        valueKey: "value",
        reconstructed: true,
      });
    }
  }
}

module.exports = Invoice;
