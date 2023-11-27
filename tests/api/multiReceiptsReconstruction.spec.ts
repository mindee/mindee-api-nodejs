import { expect } from "chai";
import { promises as fs } from "fs";
import * as path from "path";
import { Document } from "../../src/parsing/common";
import { MultiReceiptsDetectorV1 } from "../../src/product";
import { extractReceipts } from "../../src/imageOperations";
import { PathInput } from "../../src/input";

describe("A Multi-Receipt Document", () => {
    it("should be split into the proper receipts", async () => {
        const jsonData = await fs.readFile(
            path.resolve("tests/data/products/multi_receipts_detector/response_v1/complete.json")
        );
        const sourceDoc = new PathInput({ inputPath: path.resolve("tests/data/products/multi_receipts_detector/default_sample.jpg") });
        await sourceDoc.init();
        const response = JSON.parse(jsonData.toString());
        const doc = new Document(MultiReceiptsDetectorV1, response.document);
        const extractedReceipts = await extractReceipts(sourceDoc, doc.inference);
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
});
