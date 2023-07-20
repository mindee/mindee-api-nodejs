import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { Response } from "../../src";
import * as product from "../../src/product";
import { InputSource, INPUT_TYPE_PATH } from "../../src/input";

const dataPath = {
  receiptV5: "tests/data/receipt/response_v5/complete.json",
  invoiceV4: "tests/data/invoice/response_v4/complete.json",
  passportV1: "tests/data/passport/response_v1/complete.json",
  customV1: "tests/data/custom/response_v1/complete.json",
};

describe("Synchronous API predict response", () => {
  it("should build a Receipt response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptV5));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new Response<product.ReceiptV5>(product.ReceiptV5, {
      httpResponse: httpResponse,
      input: new InputSource({ inputType: INPUT_TYPE_PATH }),
      error: false,
    });
    expect(response.document).to.not.be.undefined;
    expect(response.pages.length).to.be.equals(1);
    response.pages.forEach((page, idx) => {
      expect(page.pageId).to.be.equals(idx);
      expect(page.fullText).to.not.be.undefined;
    });
  });

  it("should build an Invoice response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceV4));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new Response<product.InvoiceV4>(product.InvoiceV4, {
      httpResponse: httpResponse,
      input: new InputSource({ inputType: INPUT_TYPE_PATH }),
      error: false,
    });
    expect(response.document).to.not.be.undefined;
    expect(response.pages.length).to.be.equals(2);
    response.pages.forEach((page, idx) => {
      expect(page.pageId).to.be.equals(idx);
      expect(page.fullText).to.not.be.undefined;
    });
  });

  it("should build a Passport response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.passportV1));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new Response<product.PassportV1>(product.PassportV1, {
      httpResponse: httpResponse,
      input: new InputSource({ inputType: INPUT_TYPE_PATH }),
      error: false,
    });
    expect(response.document).to.not.be.undefined;
    expect(response.pages.length).to.be.equals(1);
    response.pages.forEach((page, idx) => {
      expect(page.pageId).to.be.equals(idx);
    });
  });

  it("should build a Custom Doc response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.customV1));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new Response<product.CustomV1>(product.CustomV1, {
      httpResponse: httpResponse,
      documentType: "field_test",
      input: new InputSource({ inputType: INPUT_TYPE_PATH }),
      error: false,
    });
    expect(response.document).to.not.be.undefined;
    expect(response.pages.length).to.be.equals(2);
    response.pages.forEach((page, idx) => {
      expect(page.pageId).to.be.equals(idx);
      expect(page.fullText).to.be.undefined;
    });
  });
});
