import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { PredictResponse } from "../../src";
import { CustomV1, InvoiceV4, ReceiptV4 } from "../../src/product";
import { LicensePlateV1 } from "../../src/product/eu";

const dataPath = {
  receiptV4: "tests/data/products/expense_receipts/response_v4/complete.json",
  invoiceV4: "tests/data/products/invoices/response_v4/complete.json",
  licensePlateV1: "tests/data/products/license_plates/response_v1/complete.json",
  customV1: "tests/data/products/custom/response_v1/complete.json",
};

describe("Synchronous API predict response", () => {
  it("should build a Receipt response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptV4));
    const httpResponse = JSON.parse(jsonData.toString());
    const response = new PredictResponse(ReceiptV4, httpResponse);
    expect(response.document.inference.prediction).to.not.be.undefined;
    expect(response.document.inference.pages.length).to.be.equals(1);
    expect(response.document.nPages).to.be.equals(1);
    response.document.inference.pages.forEach((page, idx) => {
      expect(page.id).to.be.equals(idx);
      expect(page.toString()).to.not.be.undefined;
    });
  });

  it("should build an Invoice response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceV4));
    const httpResponse =  JSON.parse(jsonData.toString());
    const response = new PredictResponse(InvoiceV4, httpResponse);
    expect(response.document.inference.prediction).to.not.be.undefined;
    expect(response.document.inference.pages.length).to.be.equals(2);
    expect(response.document.nPages).to.be.equals(2);
    response.document.inference.pages.forEach((page, idx) => {
      expect(page.id).to.be.equals(idx);
      expect(page.toString()).to.not.be.undefined;
    });
  });

  it("should build a License Plate response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.licensePlateV1));
    const httpResponse = JSON.parse(jsonData.toString());
    const response = new PredictResponse(LicensePlateV1, httpResponse);
    expect(response.document.inference.prediction).to.not.be.undefined;
    expect(response.document.inference.pages.length).to.be.equals(1);
    expect(response.document.nPages).to.be.equals(1);
    response.document.inference.pages.forEach((page, idx) => {
      expect(page.id).to.be.equals(idx);
    });
  });

  it("should build a Custom Doc response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.customV1));
    const httpResponse = JSON.parse(jsonData.toString());
    const response = new PredictResponse(CustomV1, httpResponse);
    expect(response.document.inference.prediction).to.not.be.undefined;
    expect(response.document.inference.pages.length).to.be.equals(2);
    expect(response.document.nPages).to.be.equals(2);
    response.document.inference.pages.forEach((page, idx) => {
      expect(page.id).to.be.equals(idx);
      expect(page.toString()).to.not.be.undefined;
    });
  });
});
