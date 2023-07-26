import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { PredictResponse } from "../../src";
import * as product from "../../src/product";

const dataPath = {
  receiptV4: "tests/data/receipt/response_v4/complete.json",
  invoiceV4: "tests/data/invoice/response_v4/complete.json",
  licensePlateV1: "tests/data/eu/license_plate/response_v1/complete.json",
  customV1: "tests/data/custom/response_v1/complete.json",
};

describe("Synchronous API predict response", () => {
  it("should build a Receipt response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptV4));
    const httpResponse = JSON.parse(jsonData.toString());
    const response = new PredictResponse(product.ReceiptV4, httpResponse);
    expect(response.document.inference.prediction).to.not.be.undefined;
    expect(response.document.inference?.pages.length).to.be.equals(1);
    response.document.inference?.pages.forEach((page, idx) => {
      expect(page.id).to.be.equals(idx);
      expect(page.toString()).to.not.be.undefined;
    });
  });

  it("should build an Invoice response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceV4));
    const httpResponse =  JSON.parse(jsonData.toString());
    const response = new PredictResponse(product.InvoiceV4, httpResponse);
    expect(response.document.inference.prediction).to.not.be.undefined;
    expect(response.document.inference?.pages.length).to.be.equals(2);
    response.document.inference?.pages.forEach((page, idx) => {
      expect(page.id).to.be.equals(idx);
      expect(page.toString()).to.not.be.undefined;
    });
  });

  it("should build a License Plate response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.licensePlateV1));
    const httpResponse = JSON.parse(jsonData.toString());
    const response = new PredictResponse(product.eu.LicensePlateV1, httpResponse);
    expect(response.document.inference.prediction).to.not.be.undefined;
    expect(response.document.inference?.pages.length).to.be.equals(1);
    response.document.inference?.pages.forEach((page, idx) => {
      expect(page.id).to.be.equals(idx);
    });
  });

  it("should build a Custom Doc response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.customV1));
    const httpResponse = JSON.parse(jsonData.toString());
    const response = new PredictResponse(product.CustomV1, httpResponse);
    expect(response.document.inference.prediction).to.not.be.undefined;
    expect(response.document.inference?.pages.length).to.be.equals(2);
    response.document.inference?.pages.forEach((page, idx) => {
      expect(page.id).to.be.equals(idx);
      expect(page.toString()).to.not.be.undefined;
    });
  });
});
