import { Invoice } from "@mindee/documents";
import fs from "fs/promises";
import path from "path";
import { expect } from "chai";
import * as api_path from "#apiPaths";

describe("Invoice Object initialization", async () => {
  before(async function () {
    const jsonDataNA = await fs.readFile(
      path.resolve(api_path.invoices.all_na)
    );
    this.basePrediction =
      JSON.parse(jsonDataNA).document.inference.pages[0].prediction;
  });

  it("should initialize from a prediction object", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.invoices.all));
    const response = JSON.parse(jsonData);
    const invoice = new Invoice({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    expect(invoice.invoiceDate.value).to.be.equal("2020-02-17");
    expect(invoice.checklist.taxesMatchTotalIncl).to.be.true;
    expect(invoice.checklist.taxesMatchTotalExcl).to.be.true;
    expect(invoice.checklist.taxesPlusTotalExclMatchTotalIncl).to.be.true;
    expect(invoice.totalTax.value).to.be.equal(97.98);
    expect(typeof invoice.toString()).to.be.equal("string");
  });

  it("should initialize from a N/A prediction object", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.invoices.all_na));
    const response = JSON.parse(jsonData);
    const invoice = new Invoice({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    expect(invoice.locale.value).to.be.undefined;
    expect(invoice.totalIncl.value).to.be.undefined;
    expect(invoice.totalExcl.value).to.be.undefined;
    expect(invoice.invoiceDate.value).to.be.undefined;
    expect(invoice.invoiceNumber.value).to.be.undefined;
    expect(invoice.dueDate.value).to.be.undefined;
    expect(invoice.supplier.value).to.be.undefined;
    expect(invoice.supplierAddress.value).to.be.undefined;
    expect(invoice.customerName.value).to.be.undefined;
    expect(invoice.customerAddress.value).to.be.undefined;
    expect(invoice.customerCompanyRegistration.value).to.be.undefined;
    expect(invoice.taxes.length).to.be.equal(0);
    expect(invoice.paymentDetails.length).to.be.equal(0);
    expect(invoice.companyNumber.length).to.be.equal(0);
    expect(invoice.orientation.value).to.be.equal(0);
    expect(Object.values(invoice.checklist)).to.have.ordered.members([
      false,
      false,
      false,
    ]);
  });

  it("should not reconstruct totalIncl without taxes", function () {
    const invoiceNoIncludeTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.0 },
        total_excl: { value: 240.5, confidence: 0.9 },
        taxes: [],
      },
    });
    expect(invoiceNoIncludeTaxes.totalIncl.value).to.be.undefined;
  });

  it("should not reconstruct totalIncl without totalExcl", function () {
    const invoiceNoIncludeTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.0 },
        total_excl: { value: "N/A", confidence: 0.0 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(invoiceNoIncludeTaxes.totalIncl.value).to.be.undefined;
  });

  it("should not reconstruct totalIncl with totalIncl already set", function () {
    const invoiceNoIncludeTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 260, confidence: 0.4 },
        total_excl: { value: 240.5, confidence: 0.9 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(invoiceNoIncludeTaxes.totalIncl.value).to.be.equal(260);
    expect(invoiceNoIncludeTaxes.totalIncl.probability).to.be.equal(0.4);
  });

  it("should reconstruct totalIncl", function () {
    const invoiceNoIncludeTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.0 },
        total_excl: { value: 240.5, confidence: 0.9 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(invoiceNoIncludeTaxes.totalIncl.value).to.be.equal(250);
    expect(invoiceNoIncludeTaxes.totalIncl.probability).to.be.equal(0.81);
  });

  it("should not reconstruct totalExcl without totalIncl", function () {
    const invoiceNoExclTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.0 },
        total_excl: { value: "N/A", confidence: 0.0 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(invoiceNoExclTaxes.totalExcl.value).to.be.undefined;
  });

  it("should not reconstruct totalExcl without taxes", function () {
    const invoiceNoExclTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 1150.2, confidence: 0.7 },
        total_excl: { value: "N/A", confidence: 0.0 },
        taxes: [],
      },
    });
    expect(invoiceNoExclTaxes.totalExcl.value).to.be.undefined;
  });

  it("should not reconstruct totalExcl with totalExcl already set", function () {
    const invoiceNoExclTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 1150.2, confidence: 0.7 },
        total_excl: { value: 1050.0, confidence: 0.4 },
        taxes: [],
      },
    });
    expect(invoiceNoExclTaxes.totalExcl.value).to.be.equal(1050.0);
    expect(invoiceNoExclTaxes.totalExcl.probability).to.be.equal(0.4);
  });

  it("should reconstruct totalExcl", function () {
    const invoiceNoExclTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 1150.2, confidence: 0.6 },
        total_excl: { value: "N/A", confidence: 0.0 },
        taxes: [
          { rate: 20, value: 10.2, confidence: 0.5 },
          { rate: 10, value: 40.0, confidence: 0.1 },
        ],
      },
    });
    expect(invoiceNoExclTaxes.totalExcl.value).to.be.equal(1100);
    expect(invoiceNoExclTaxes.totalExcl.probability).to.be.equal(0.03);
  });

  it("should not reconstruct totalTax without taxes", function () {
    const invoiceNoExclTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        taxes: [],
      },
    });
    expect(invoiceNoExclTaxes.totalTax.value).to.be.undefined;
  });

  it("should reconstruct totalTax", function () {
    const invoiceNoExclTaxes = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        taxes: [
          { rate: 20, value: 10.2, confidence: 0.5 },
          { rate: 10, value: 40.0, confidence: 0.1 },
        ],
      },
    });
    expect(invoiceNoExclTaxes.totalTax.value).to.be.equal(50.2);
    expect(invoiceNoExclTaxes.totalTax.probability).to.be.equal(0.05);
  });

  it("should match on totalIncl", function () {
    const invoice = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.25, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(invoice.checklist.taxesMatchTotalIncl).to.be.true;
    expect(invoice.totalIncl.probability).to.be.equal(1.0);
    invoice.taxes.map((tax) => expect(tax.probability).to.be.equal(1.0));
  });

  it("should not match on totalIncl", function () {
    const invoice = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.25, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.9, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(invoice.checklist.taxesMatchTotalIncl).to.be.false;
  });

  it("should not match on totalIncl 2", function () {
    const invoice = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.25, confidence: 0.6 },
        taxes: [{ rate: 20, value: 0.0, confidence: 0.5 }],
      },
    });
    expect(invoice.checklist.taxesMatchTotalIncl).to.be.false;
  });

  it("should match on totalExcl", function () {
    const invoice = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_excl: { value: 456.15, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(invoice.checklist.taxesMatchTotalExcl).to.be.true;
    expect(invoice.totalExcl.probability).to.be.equal(1.0);
    invoice.taxes.map((tax) => expect(tax.probability).to.be.equal(1.0));
  });

  it("should not match on totalExcl", function () {
    const invoice = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_excl: { value: 507.25, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.9, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(invoice.checklist.taxesMatchTotalExcl).to.be.false;
  });

  it("should not match on totalExcl 2", function () {
    const invoice = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_excl: { value: 507.25, confidence: 0.6 },
        taxes: [{ rate: 20, value: 0.0, confidence: 0.5 }],
      },
    });
    expect(invoice.checklist.taxesMatchTotalExcl).to.be.false;
  });

  it("should match on Taxes + totalExcl = totalIncl", function () {
    const invoice = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.25, confidence: 0.6 },
        total_excl: { value: 456.15, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(invoice.checklist.taxesPlusTotalExclMatchTotalIncl).to.be.true;
    expect(invoice.totalIncl.probability).to.be.equal(1.0);
    expect(invoice.totalExcl.probability).to.be.equal(1.0);
    invoice.taxes.map((tax) => expect(tax.probability).to.be.equal(1.0));
  });

  it("should not match on Taxes + totalExcl = totalIncl", function () {
    const invoice = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.2, confidence: 0.6 },
        total_excl: { value: 456.15, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(invoice.checklist.taxesPlusTotalExclMatchTotalIncl).to.be.false;
  });

  it("should not match on Taxes + totalExcl = totalIncl 2", function () {
    const invoice = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.25, confidence: 0.6 },
        total_excl: { value: 456.15, confidence: 0.6 },
        taxes: [{ rate: 20, value: 0, confidence: 0.5 }],
      },
    });
    expect(invoice.checklist.taxesPlusTotalExclMatchTotalIncl).to.be.false;
  });
});
