import { expect } from "chai";
import { promises as fs } from "fs";
import path from "path";
import { MultiReceiptsDetectorV1 } from "@/v1/product/index.js";
import { extractReceipts } from "@/v1/extraction/index.js";
import { PathInput } from "@/index.js";
import { V1_PRODUCT_PATH } from "../../index.js";

const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/response_v1/complete.json"),
  fileSample: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/default_sample.jpg"),
  completeMultiPage: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/response_v1/multipage_sample.json"),
  multiPageSample: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/multipage_sample.pdf"),
};

describe("A single-page multi-receipts document", () => {
  it("should be split properly.", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new MultiReceiptsDetectorV1(response.document.inference);
    const inputSample = new PathInput({ inputPath: dataPath.fileSample });
    await inputSample.init();
    const extractedReceipts = await extractReceipts(inputSample, doc);
    expect(extractedReceipts.length).to.be.equals(6);
    for (let i = 0; i < extractedReceipts.length; i++) {
      expect(extractedReceipts[i].buffer).to.be.not.null;
      expect(extractedReceipts[i].pageId).to.be.equals(0);
      expect(extractedReceipts[i].receiptId).to.be.equals(i);
    }
  });
});
describe("A multi-page multi-receipts document", () => {
  it("should be split properly.", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.completeMultiPage));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new MultiReceiptsDetectorV1(response.document.inference);
    const inputSample = new PathInput({ inputPath: dataPath.multiPageSample });
    await inputSample.init();
    const extractedReceipts = await extractReceipts(inputSample, doc);
    expect(extractedReceipts.length).to.be.equals(5);

    expect(extractedReceipts[0].buffer).to.be.not.null;
    expect(extractedReceipts[0].pageId).to.be.equals(0);
    expect(extractedReceipts[0].receiptId).to.be.equals(0);

    expect(extractedReceipts[1].buffer).to.be.not.null;
    expect(extractedReceipts[1].pageId).to.be.equals(0);
    expect(extractedReceipts[1].receiptId).to.be.equals(1);

    expect(extractedReceipts[2].buffer).to.be.not.null;
    expect(extractedReceipts[2].pageId).to.be.equals(0);
    expect(extractedReceipts[2].receiptId).to.be.equals(2);

    expect(extractedReceipts[3].buffer).to.be.not.null;
    expect(extractedReceipts[3].pageId).to.be.equals(1);
    expect(extractedReceipts[3].receiptId).to.be.equals(0);

    expect(extractedReceipts[4].buffer).to.be.not.null;
    expect(extractedReceipts[4].pageId).to.be.equals(1);
    expect(extractedReceipts[4].receiptId).to.be.equals(1);
  });
});
