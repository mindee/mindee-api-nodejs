import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";


const dataPath = {
  complete: "tests/data/products/invoices/response_v4/complete.json",
  empty: "tests/data/products/invoices/response_v4/empty.json",
  docString: "tests/data/products/invoices/response_v4/summary_full.rst",
  page0String: "tests/data/products/invoices/response_v4/summary_page0.rst",
};

describe("InvoiceV4 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.InvoiceV4, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.locale.value).to.be.undefined;
    expect(docPrediction.invoiceNumber.value).to.be.undefined;
    expect(docPrediction.referenceNumbers.length).to.be.equals(0);
    expect(docPrediction.date.value).to.be.undefined;
    expect(docPrediction.dueDate.value).to.be.undefined;
    expect(docPrediction.totalNet.value).to.be.undefined;
    expect(docPrediction.totalAmount.value).to.be.undefined;
    expect(docPrediction.totalTax.value).to.be.undefined;
    expect(docPrediction.taxes.length).to.be.equals(0);
    expect(docPrediction.supplierPaymentDetails.length).to.be.equals(0);
    expect(docPrediction.supplierName.value).to.be.undefined;
    expect(docPrediction.supplierCompanyRegistrations.length).to.be.equals(0);
    expect(docPrediction.supplierAddress.value).to.be.undefined;
    expect(docPrediction.customerName.value).to.be.undefined;
    expect(docPrediction.customerCompanyRegistrations.length).to.be.equals(0);
    expect(docPrediction.customerAddress.value).to.be.undefined;
    expect(docPrediction.lineItems.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.InvoiceV4, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
