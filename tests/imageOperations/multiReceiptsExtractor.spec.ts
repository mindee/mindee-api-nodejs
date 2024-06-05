import {expect} from "chai";
import {promises as fs} from "fs";
import path from "path";
import {MultiReceiptsDetectorV1} from "../../src/product";
import {extractReceipts} from "../../src/imageOperations";
import {PathInput} from "../../src/input";

const dataPath = {
  complete: "tests/data/products/multi_receipts_detector/response_v1/complete.json",
  fileSample: "tests/data/products/multi_receipts_detector/default_sample.jpg"
}

describe("A multi-receipts document", () => {
  it("should be split properly.", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new MultiReceiptsDetectorV1(response.document.inference);
    const inputSample = new PathInput({inputPath: dataPath.fileSample});
    await inputSample.init();
    const extractedReceipts = await extractReceipts(inputSample, doc);
    expect(extractedReceipts.length).to.be.equals(6);
    await fs.writeFile("local_test/buffer.txt", extractedReceipts[0].buffer);
    for (let i = 0; i < extractedReceipts.length; i++) {
      expect(extractedReceipts[i].buffer).to.be.not.null;
      expect(extractedReceipts[i].pageId).to.be.equals(0);
      expect(extractedReceipts[i].receiptId).to.be.equals(i);
    }
  });
});
