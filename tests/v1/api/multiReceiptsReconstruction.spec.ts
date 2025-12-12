import { expect } from "chai";
import { promises as fs } from "fs";
import * as path from "path";
import { Document, PathInput } from "../../../src";
import { MultiReceiptsDetectorV1 } from "../../../src/product";
import { extractReceipts } from "../../../src/imageOperations";
import { RESOURCE_PATH, V1_PRODUCT_PATH } from "../../index";

describe("MindeeV1 - A Multi-Receipt Document", () => {
  let extractedReceipts: any[];
  let sourceDoc: PathInput;
  before(async () => {

    const jsonData = await fs.readFile(
      path.join(V1_PRODUCT_PATH, "multi_receipts_detector/response_v1/complete.json")
    );

    sourceDoc = new PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/default_sample.jpg"),
    });
    await sourceDoc.init();

    const response = JSON.parse(jsonData.toString());
    const doc = new Document(MultiReceiptsDetectorV1, response.document);
    extractedReceipts = await extractReceipts(sourceDoc, doc.inference);
  });
  it("should be split into the proper receipts", async () => {
    expect(extractedReceipts.length).to.be.equals(6);
    let i = 0;
    for (const extractedReceipt of extractedReceipts) {
      expect(extractedReceipt.pageId).to.be.equal(0);
      expect(extractedReceipt.receiptId).to.be.equal(i);
      expect(Buffer.byteLength(extractedReceipt.asSource().fileObject)).to.be.lessThan(10485760);
      expect(Buffer.byteLength(extractedReceipt.asSource().fileObject)).to.be.greaterThan(100000);
      i++;
    }
  });

  it("should be saved locally", async () => {
    let i = 0;
    for (const extractedReceipt of extractedReceipts) {
      extractedReceipt.saveToFile(path.join(RESOURCE_PATH, `output/extracted_receipt_${i}.pdf`));
      await extractedReceipt.saveToFileAsync(path.join(RESOURCE_PATH, `output/extracted_receipt_${i}.png`));
      await extractedReceipt.saveToFileAsync(path.join(RESOURCE_PATH, `output/extracted_receipt_${i}.jpg`));
      const pdfStat = await fs.stat(path.join(RESOURCE_PATH, `output/extracted_receipt_${i}.pdf`));
      expect(pdfStat.size).to.be.greaterThan(500000); // Arbitrary to assert noticeable discrepancies between OSs.
      const jpgStat = await fs.stat(path.join(RESOURCE_PATH, `output/extracted_receipt_${i}.jpg`));
      expect(jpgStat.size).to.be.greaterThan(40000);
      const pngStat = await fs.stat(path.join(RESOURCE_PATH, `output/extracted_receipt_${i}.png`));
      expect(pngStat.size).to.be.greaterThan(300000);
      i++;
    }
  }).timeout(10000);
  after(async () => {
    for (let i = 0; i < extractedReceipts.length; i++) {
      await fs.unlink(path.join(RESOURCE_PATH, `output/extracted_receipt_${i}.pdf`));
      await fs.unlink(path.join(RESOURCE_PATH, `output/extracted_receipt_${i}.jpg`));
      await fs.unlink(path.join(RESOURCE_PATH, `output/extracted_receipt_${i}.png`));
    }
  });
});
