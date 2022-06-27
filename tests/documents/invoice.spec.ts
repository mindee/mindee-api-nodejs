import { Invoice } from "../../mindee/documents";
import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { dataPath } from "../apiPaths";
import { TaxField } from "../../mindee/documents/fields";

describe("Invoice Object initialization", async () => {
  before(async function () {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.invoice.empty));
    this.basePrediction = JSON.parse(
      jsonDataNA.toString()
    ).document.inference.pages[0].prediction;
  });

  it("should initialize from a N/A prediction object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoice.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new Invoice({
      apiPrediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.locale.value).to.be.undefined;
    expect(doc.totalIncl.value).to.be.undefined;
    expect(doc.totalExcl.value).to.be.undefined;
    expect(doc.totalTax.value).to.be.undefined;
    expect(doc.date.value).to.be.undefined;
    expect(doc.invoiceNumber.value).to.be.undefined;
    expect(doc.dueDate.value).to.be.undefined;
    expect(doc.supplier.value).to.be.undefined;
    expect(doc.supplierAddress.value).to.be.undefined;
    expect(doc.customerName.value).to.be.undefined;
    expect(doc.customerAddress.value).to.be.undefined;
    expect(doc.customerCompanyRegistration.length).to.be.eq(0);
    expect(doc.taxes.length).to.be.equal(0);
    expect(doc.paymentDetails.length).to.be.equal(0);
    expect(doc.companyNumber.length).to.be.equal(0);
    expect(doc.orientation).to.be.undefined;
    expect(doc.checkAll()).to.be.false;
    expect(Object.values(doc.checklist)).to.have.ordered.members([
      false,
      false,
      false,
    ]);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoice.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new Invoice({
      apiPrediction: prediction,
    });
    const to_string = await fs.readFile(path.join(dataPath.invoice.docString));
    expect(doc.toString()).to.be.equals(to_string.toString());
    expect(doc.checkAll()).to.be.true;
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoice.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new Invoice({
      apiPrediction: pageData.prediction,
      pageNumber: pageData.id,
    });
    const to_string = await fs.readFile(
      path.join(dataPath.invoice.page0String)
    );
    expect(doc.toString()).to.be.equals(to_string.toString());
    expect(doc.checkAll()).to.be.true;
  });

  it("should not reconstruct totalIncl without taxes", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.0 },
        total_excl: { value: 240.5, confidence: 0.9 },
        taxes: [],
      },
    });
    expect(doc.totalIncl.value).to.be.undefined;
  });

  it("should not reconstruct totalIncl without totalExcl", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.0 },
        total_excl: { value: "N/A", confidence: 0.0 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(doc.totalIncl.value).to.be.undefined;
  });

  it("should not reconstruct totalIncl with totalIncl already set", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 260, confidence: 0.4 },
        total_excl: { value: 240.5, confidence: 0.9 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(doc.totalIncl.value).to.be.equal(260);
    expect(doc.totalIncl.confidence).to.be.equal(0.4);
  });

  it("should reconstruct totalIncl", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.0 },
        total_excl: { value: 240.5, confidence: 0.9 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(doc.totalIncl.value).to.be.equal(250);
    expect(doc.totalIncl.confidence).to.be.equal(0.81);
  });

  it("should not reconstruct totalExcl without totalIncl", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: "N/A", confidence: 0.0 },
        total_excl: { value: "N/A", confidence: 0.0 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(doc.totalExcl.value).to.be.undefined;
  });

  it("should not reconstruct totalExcl without taxes", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 1150.2, confidence: 0.7 },
        total_excl: { value: "N/A", confidence: 0.0 },
        taxes: [],
      },
    });
    expect(doc.totalExcl.value).to.be.undefined;
  });

  it("should not reconstruct totalExcl with totalExcl already set", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 1150.2, confidence: 0.7 },
        total_excl: { value: 1050.0, confidence: 0.4 },
        taxes: [],
      },
    });
    expect(doc.totalExcl.value).to.be.equal(1050.0);
    expect(doc.totalExcl.confidence).to.be.equal(0.4);
  });

  it("should reconstruct totalExcl", function () {
    const doc = new Invoice({
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
    expect(doc.totalExcl.value).to.be.equal(1100);
    expect(doc.totalExcl.confidence).to.be.equal(0.03);
  });

  it("should not reconstruct totalTax without taxes", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        taxes: [],
      },
    });
    expect(doc.totalTax.value).to.be.undefined;
  });

  it("should reconstruct totalTax", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        taxes: [
          { rate: 20, value: 10.2, confidence: 0.5 },
          { rate: 10, value: 40.0, confidence: 0.1 },
        ],
      },
    });
    expect(doc.totalTax.value).to.be.equal(50.2);
    expect(doc.totalTax.confidence).to.be.equal(0.05);
  });

  it("should match on totalIncl", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.25, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesMatchTotalIncl).to.be.true;
    expect(doc.totalIncl.confidence).to.be.equal(1.0);
    (doc.taxes as TaxField[]).map((tax) =>
      expect(tax.confidence).to.be.equal(1.0)
    );
  });

  it("should not match on totalIncl", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.25, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.9, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesMatchTotalIncl).to.be.false;
  });

  it("should not match on totalIncl 2", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.25, confidence: 0.6 },
        taxes: [{ rate: 20, value: 0.0, confidence: 0.5 }],
      },
    });
    expect(doc.checklist.taxesMatchTotalIncl).to.be.false;
  });

  it("should match on totalExcl", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_excl: { value: 456.15, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesMatchTotalExcl).to.be.true;
    expect(doc.totalExcl.confidence).to.be.equal(1.0);
    (doc.taxes as TaxField[]).map((tax) =>
      expect(tax.confidence).to.be.equal(1.0)
    );
  });

  it("should not match on totalExcl", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_excl: { value: 507.25, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.9, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesMatchTotalExcl).to.be.false;
  });

  it("should not match on totalExcl 2", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_excl: { value: 507.25, confidence: 0.6 },
        taxes: [{ rate: 20, value: 0.0, confidence: 0.5 }],
      },
    });
    expect(doc.checklist.taxesMatchTotalExcl).to.be.false;
  });

  it("should match on Taxes + totalExcl = totalIncl", function () {
    const doc = new Invoice({
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
    expect(doc.checklist.taxesAndTotalExclMatchTotalIncl).to.be.true;
    expect(doc.totalIncl.confidence).to.be.equal(1.0);
    expect(doc.totalExcl.confidence).to.be.equal(1.0);
    (doc.taxes as TaxField[]).map((tax) =>
      expect(tax.confidence).to.be.equal(1.0)
    );
  });

  it("should not match on Taxes + totalExcl = totalIncl", function () {
    const doc = new Invoice({
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
    expect(doc.checklist.taxesAndTotalExclMatchTotalIncl).to.be.false;
  });

  it("should not match on Taxes + totalExcl = totalIncl 2", function () {
    const doc = new Invoice({
      apiPrediction: {
        ...this.basePrediction,
        total_incl: { value: 507.25, confidence: 0.6 },
        total_excl: { value: 456.15, confidence: 0.6 },
        taxes: [{ rate: 20, value: 0, confidence: 0.5 }],
      },
    });
    expect(doc.checklist.taxesAndTotalExclMatchTotalIncl).to.be.false;
  });
});
