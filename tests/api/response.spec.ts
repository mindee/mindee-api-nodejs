import { expect } from "chai";
import {CustomResponse, InvoiceV3Response, PassportV1Response, ReceiptV3Response} from "../../src/api";
import {DOC_TYPE_INVOICE_V3, DOC_TYPE_RECEIPT_V3} from "../../src/documents";
import { promises as fs } from "fs";
import path from "path";
import { dataPath } from "../apiPaths";
import { Input, INPUT_TYPE_PATH } from "../../src/inputs";

describe("API response", () => {
  it("should build a Receipt response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.receiptV3.complete));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new ReceiptV3Response({
      httpResponse: httpResponse,
      documentType: DOC_TYPE_RECEIPT_V3,
      input: new Input({ inputType: INPUT_TYPE_PATH }),
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
    const jsonData = await fs.readFile(path.resolve(dataPath.invoiceV3.complete));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new InvoiceV3Response({
      httpResponse: httpResponse,
      documentType: DOC_TYPE_INVOICE_V3,
      input: new Input({ inputType: INPUT_TYPE_PATH }),
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
    const jsonData = await fs.readFile(path.resolve(dataPath.passportV1.complete));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new PassportV1Response({
      httpResponse: httpResponse,
      documentType: DOC_TYPE_INVOICE_V3,
      input: new Input({ inputType: INPUT_TYPE_PATH }),
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
    const response = new CustomResponse({
      httpResponse: httpResponse,
      documentType: "field_test",
      input: new Input({ inputType: INPUT_TYPE_PATH }),
      error: false,
    });
    expect(response.document).to.not.be.undefined;
    expect(response.documentType).to.be.equals("field_test");
    expect(response.pages.length).to.be.equals(2);
    response.pages.forEach((page, idx) => {
      expect(page.pageId).to.be.equals(idx);
      expect(page.fullText).to.be.undefined;
    });
  });
});
