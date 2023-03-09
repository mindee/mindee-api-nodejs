import { expect } from "chai";
import { Response } from "../../src/api";
import { promises as fs } from "fs";
import path from "path";
import { InputSource, INPUT_TYPE_PATH } from "../../src/inputs";
import { ReceiptV4 } from "../../src";

describe("API response - async predict", () => {
  it("should request an async prediction for a Receipt with success", async () => {
    const jsonData = await fs.readFile(
      path.resolve("tests/data/async/enqueue_success_response.json")
    );
    const httpResponse = {
      data: JSON.parse(jsonData.toString()),
    };
    const response = new Response<ReceiptV4>(ReceiptV4, {
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
});
