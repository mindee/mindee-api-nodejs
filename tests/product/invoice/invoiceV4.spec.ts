import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";
import { InvoiceV4 } from "../../../src/product";
import { Page } from "../../../src/parsing/common";
import { InvoiceV4Document } from "../../../src/product/invoice/invoiceV4Document";

const dataPath = {
  complete: "tests/data/products/invoices/response_v4/complete.json",
  empty: "tests/data/products/invoices/response_v4/empty.json",
  docString: "tests/data/products/invoices/response_v4/summary_full.rst",
  page0String: "tests/data/products/invoices/response_v4/summary_page0.rst",
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
    const doc = new Page(InvoiceV4Document, response.document.inference.pages[0], 0);
    expect(doc.prediction.locale.value).to.be.undefined;
    expect(doc.prediction.totalAmount.value).to.be.undefined;
    expect(doc.prediction.totalNet.value).to.be.undefined;
    expect(doc.prediction.totalTax.value).to.be.undefined;
    expect(doc.prediction.date.value).to.be.undefined;
    expect(doc.prediction.invoiceNumber.value).to.be.undefined;
    expect(doc.prediction.dueDate.value).to.be.undefined;
    expect(doc.prediction.supplierName.value).to.be.undefined;
    expect(doc.prediction.supplierAddress.value).to.be.undefined;
    expect(doc.prediction.customerName.value).to.be.undefined;
    expect(doc.prediction.customerAddress.value).to.be.undefined;
    expect(doc.prediction.customerCompanyRegistrations.length).to.be.eq(0);
    expect(doc.prediction.taxes.length).to.be.equal(0);
    expect(doc.prediction.supplierPaymentDetails.length).to.be.equal(0);
    expect(doc.prediction.supplierCompanyRegistrations.length).to.be.equal(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc: mindee.Document<InvoiceV4> = new mindee.Document(InvoiceV4, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference;
    const doc = new InvoiceV4(pageData);
    const pageString = await fs.readFile(path.join(dataPath.page0String));
    const page0: Page<InvoiceV4Document> = doc.pages[0];
    expect(page0.toString()).to.be.equals(pageString.toString());
  });
});
