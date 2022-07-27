import { expect } from "chai";
import { Response } from "../../src/api";
import { DOC_TYPE_INVOICE } from "../../src/documents";
import { promises as fs } from "fs";
import path from "path";
import { dataPath } from "../apiPaths";
import { Input, INPUT_TYPE_PATH } from "../../src/inputs";

describe("API response", () => {
  it("should build an Invoice response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.invoice.complete));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };

    const response = new Response({
      httpResponse: httpResponse,
      documentType: DOC_TYPE_INVOICE,
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

  it("should build a Custom Doc response", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.custom.complete));
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };

    const response = new Response({
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
