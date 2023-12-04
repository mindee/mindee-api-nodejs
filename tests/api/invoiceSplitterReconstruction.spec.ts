import { expect } from "chai";
import { promises as fs } from "fs";
import * as path from "path";
import { Document } from "../../src/parsing/common";
import { InvoiceSplitterV1 } from "../../src/product";
import { extractInvoices } from "../../src/imageOperations";
import { PathInput } from "../../src/input";

describe("An Multipage Invoice Document", () => {
    it("should be split into the proper invoices", async () => {
        const jsonData = await fs.readFile(
            path.resolve("tests/data/products/invoice_splitter/response_v1/complete.json")
        );
        const sourceDoc = new PathInput({ inputPath: path.resolve("tests/data/products/invoice_splitter/invoice_5p.pdf") });
        await sourceDoc.init();
        const response = JSON.parse(jsonData.toString());
        const doc = new Document(InvoiceSplitterV1, response.document);
        const extractedInvoices = await extractInvoices(sourceDoc, doc.inference);
        expect(extractedInvoices.length).to.be.equals(3);
        expect(extractedInvoices[0].pageIdMin).to.be.equal(0);
        expect(extractedInvoices[0].pageIdMax).to.be.equal(0);
        expect(extractedInvoices[1].pageIdMin).to.be.equal(1);
        expect(extractedInvoices[1].pageIdMax).to.be.equal(3);
        expect(extractedInvoices[2].pageIdMin).to.be.equal(4);
        expect(extractedInvoices[2].pageIdMax).to.be.equal(4);
        for (const extractedInvoice of extractedInvoices){
            expect(Buffer.byteLength(extractedInvoice.asSource().fileObject)).to.be.lessThan(10485760);
            expect(Buffer.byteLength(extractedInvoice.asSource().fileObject)).to.be.greaterThan(100000);
        }
    });
});
