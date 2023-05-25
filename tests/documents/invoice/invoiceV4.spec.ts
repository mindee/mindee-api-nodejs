import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { TaxField } from "../../../src/fields";
import * as mindee from "../../../src";

const dataPath = {
  complete: "tests/data/invoice/response_v4/complete.json",
  empty: "tests/data/invoice/response_v4/empty.json",
  docString: "tests/data/invoice/response_v4/doc_to_string.rst",
  page0String: "tests/data/invoice/response_v4/page0_to_string.rst",
  page1String: "tests/data/invoice/response_v4/page1_to_string.txt",
};

describe("Invoice V4 Object initialization", async () => {
  before(async function () {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.empty));
    this.basePrediction = JSON.parse(
      jsonDataNA.toString()
    ).document.inference.pages[0].prediction;
  });

  it("should initialize from a N/A prediction object", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.InvoiceV4({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.locale.value).to.be.undefined;
    expect(doc.totalAmount.value).to.be.undefined;
    expect(doc.totalNet.value).to.be.undefined;
    expect(doc.totalTax.value).to.be.undefined;
    expect(doc.date.value).to.be.undefined;
    expect(doc.invoiceNumber.value).to.be.undefined;
    expect(doc.dueDate.value).to.be.undefined;
    expect(doc.supplierName.value).to.be.undefined;
    expect(doc.supplierAddress.value).to.be.undefined;
    expect(doc.customerName.value).to.be.undefined;
    expect(doc.customerAddress.value).to.be.undefined;
    expect(doc.customerCompanyRegistrations.length).to.be.eq(0);
    expect(doc.taxes.length).to.be.equal(0);
    expect(doc.supplierPaymentDetails.length).to.be.equal(0);
    expect(doc.supplierCompanyRegistrations.length).to.be.equal(0);
    expect(doc.orientation).to.be.undefined;
    expect(doc.checkAll()).to.be.false;
    expect(Object.values(doc.checklist)).to.have.ordered.members([
      false,
      false,
      false,
    ]);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new mindee.InvoiceV4({
      prediction: prediction,
    });
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.orientation).to.be.undefined;
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(doc.checkAll()).to.be.true;
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new mindee.InvoiceV4({
      prediction: pageData.prediction,
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    const docString = await fs.readFile(path.join(dataPath.page0String));
    expect(doc.documentType.value).to.be.equal("INVOICE");
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.toString()).to.be.equals(docString.toString());
    expect(doc.checkAll()).to.be.true;
  });

  it("should not reconstruct total amount without taxes", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: "N/A", confidence: 0.0 },
        total_net: { value: 240.5, confidence: 0.9 },
        taxes: [],
      },
    });
    expect(doc.totalAmount.value).to.be.undefined;
  });

  it("should not reconstruct totalAmount without totalNet", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: "N/A", confidence: 0.0 },
        total_net: { value: "N/A", confidence: 0.0 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(doc.totalAmount.value).to.be.undefined;
  });

  it("should not reconstruct totalAmount with totalNet already set", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 260, confidence: 0.4 },
        total_net: { value: 240.5, confidence: 0.9 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(doc.totalAmount.value).to.be.equal(260);
    expect(doc.totalAmount.confidence).to.be.equal(0.4);
  });

  it("should reconstruct totalAmount", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: "N/A", confidence: 0.0 },
        total_net: { value: 240.5, confidence: 0.9 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(doc.totalAmount.value).to.be.equal(250);
    expect(doc.totalAmount.confidence).to.be.equal(0.81);
  });

  it("should not reconstruct totalNet without totalAmount", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: "N/A", confidence: 0.0 },
        total_net: { value: "N/A", confidence: 0.0 },
        taxes: [{ rate: 20, value: 9.5, confidence: 0.9 }],
      },
    });
    expect(doc.totalNet.value).to.be.undefined;
  });

  it("should not reconstruct totalNet without taxes", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 1150.2, confidence: 0.7 },
        total_net: { value: "N/A", confidence: 0.0 },
        taxes: [],
      },
    });
    expect(doc.totalNet.value).to.be.undefined;
  });

  it("should not reconstruct totalNet with totalNet already set", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 1150.2, confidence: 0.7 },
        total_net: { value: 1050.0, confidence: 0.4 },
        taxes: [],
      },
    });
    expect(doc.totalNet.value).to.be.equal(1050.0);
    expect(doc.totalNet.confidence).to.be.equal(0.4);
  });

  it("should reconstruct totalNet", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 1150.2, confidence: 0.6 },
        total_net: { value: "N/A", confidence: 0.0 },
        taxes: [
          { rate: 20, value: 10.2, confidence: 0.5 },
          { rate: 10, value: 40.0, confidence: 0.1 },
        ],
      },
    });
    expect(doc.totalNet.value).to.be.equal(1100);
    expect(doc.totalNet.confidence).to.be.equal(0.03);
  });

  it("should not reconstruct totalTax without taxes", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        taxes: [],
      },
    });
    expect(doc.totalTax.value).to.be.undefined;
  });

  it("should reconstruct totalTax", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
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

  it("should match on totalAmount", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 507.25, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesMatchTotalIncl).to.be.true;
    expect(doc.totalAmount.confidence).to.be.equal(1.0);
    (doc.taxes as TaxField[]).map((tax) =>
      expect(tax.confidence).to.be.equal(1.0)
    );
  });

  it("should not match on totalAmount", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 507.25, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.9, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesMatchTotalIncl).to.be.false;
  });

  it("should not match on totalAmount 2", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 507.25, confidence: 0.6 },
        taxes: [{ rate: 20, value: 0.0, confidence: 0.5 }],
      },
    });
    expect(doc.checklist.taxesMatchTotalIncl).to.be.false;
  });

  it("should match on totalNet", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_net: { value: 456.15, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesMatchTotalExcl).to.be.true;
    expect(doc.totalNet.confidence).to.be.equal(1.0);
    (doc.taxes as TaxField[]).map((tax) =>
      expect(tax.confidence).to.be.equal(1.0)
    );
  });

  it("should not match on totalNet", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_net: { value: 507.25, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.9, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesMatchTotalExcl).to.be.false;
  });

  it("should not match on totalNet 2", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_net: { value: 507.25, confidence: 0.6 },
        taxes: [{ rate: 20, value: 0.0, confidence: 0.5 }],
      },
    });
    expect(doc.checklist.taxesMatchTotalExcl).to.be.false;
  });

  it("should match on Taxes + totalNet = totalAmount", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 507.25, confidence: 0.6 },
        total_net: { value: 456.15, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesAndTotalExclMatchTotalIncl).to.be.true;
    expect(doc.totalAmount.confidence).to.be.equal(1.0);
    expect(doc.totalNet.confidence).to.be.equal(1.0);
    (doc.taxes as TaxField[]).map((tax) =>
      expect(tax.confidence).to.be.equal(1.0)
    );
  });

  it("should not match on Taxes + totalNet = totalAmount", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 507.2, confidence: 0.6 },
        total_net: { value: 456.15, confidence: 0.6 },
        taxes: [
          { rate: 20, value: 10.99, confidence: 0.5 },
          { rate: 10, value: 40.12, confidence: 0.1 },
        ],
      },
    });
    expect(doc.checklist.taxesAndTotalExclMatchTotalIncl).to.be.false;
  });

  it("should not match on Taxes + totalNet = totalAmount 2", function () {
    const doc = new mindee.InvoiceV4({
      prediction: {
        ...this.basePrediction,
        total_amount: { value: 507.25, confidence: 0.6 },
        total_net: { value: 456.15, confidence: 0.6 },
        taxes: [{ rate: 20, value: 0, confidence: 0.5 }],
      },
    });
    expect(doc.checklist.taxesAndTotalExclMatchTotalIncl).to.be.false;
  });
});
