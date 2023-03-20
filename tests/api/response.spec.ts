import { expect } from "chai";
import { Response } from "../../src/api";
import { CustomV1, InvoiceV3, PassportV1, ReceiptV3 } from "../../src";
import { promises as fs } from "fs";
import path from "path";
import { dataPath } from "../apiPaths";
import { InputSource, INPUT_TYPE_PATH } from "../../src/inputs";

describe("Synchronous API predict response", () => {
  it("should build a Receipt response", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.receiptV3.complete)
    );
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new Response<ReceiptV3>(ReceiptV3, {
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
    const jsonData = await fs.readFile(
      path.resolve(dataPath.invoiceV3.complete)
    );
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new Response<InvoiceV3>(InvoiceV3, {
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

  it("should build a Password response", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.passportV1.complete)
    );
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new Response<PassportV1>(PassportV1, {
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
    const jsonData = await fs.readFile(path.resolve(dataPath.custom.complete));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new Response<CustomV1>(CustomV1, {
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
