import { expect } from "chai";
import * as path from "path";
import { Client, PathInput } from "../../../src";
import { MultiReceiptsDetectorV1, ReceiptV5 } from "../../../src/product";
import { extractReceipts } from "../../../src/imageOperations";
import { RESOURCE_PATH, V1_PRODUCT_PATH } from "../../index";
import { LocalInputSource } from "../../../src/input";
import { setTimeout } from "node:timers/promises";

const apiKey = process.env.MINDEE_API_KEY;
let client: Client;
let sourceDoc: LocalInputSource;

describe("MindeeV1 - A Multi-Receipt Image", () => {
  before(async () => {
    sourceDoc = new PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/default_sample.jpg"),
    });
    await sourceDoc.init();
    client = new Client({ apiKey });
  });

  it("should send to the server and cut properly", async () => {
    const multiReceiptResult = await client.parse(MultiReceiptsDetectorV1, sourceDoc);
    expect(multiReceiptResult.document?.inference.prediction.receipts.length).to.be.equals(6);
    expect(multiReceiptResult.document?.inference.pages[0].orientation?.value).to.be.equals(90);
    const receipts = await extractReceipts(sourceDoc, multiReceiptResult.document!.inference);
    expect(receipts.length).to.be.equals(6);
    const extractedReceipts = await extractReceipts(sourceDoc, multiReceiptResult.document!.inference);
    expect(extractedReceipts.length).to.be.equals(6);
    const receiptsResults = [];
    let i = 0;
    for (const extractedReceipt of extractedReceipts) {
      const localInput = extractedReceipt.asSource();
      extractedReceipt.saveToFile(path.join(RESOURCE_PATH, `output/extracted_receipt${i}.pdf`));
      receiptsResults.push(await client.parse(ReceiptV5, localInput));
      i++;
      await setTimeout(1000);
    }

    expect(receiptsResults[0].document.inference.prediction.lineItems.length).to.be.equals(0);

    expect(receiptsResults[1].document.inference.prediction.lineItems.length).to.be.equals(1);
    expect(receiptsResults[1].document.inference.prediction.lineItems[0].totalAmount).to.be.equals(21.5);

    expect(receiptsResults[2].document.inference.prediction.lineItems.length).to.be.equals(2);
    expect(receiptsResults[2].document.inference.prediction.lineItems[0].totalAmount).to.be.equals(11.5);
    expect(receiptsResults[2].document.inference.prediction.lineItems[1].totalAmount).to.be.equals(2);

    expect(receiptsResults[3].document.inference.prediction.lineItems.length).to.be.equals(1);
    expect(receiptsResults[3].document.inference.prediction.lineItems[0].totalAmount).to.be.equals(16.5);

    expect(receiptsResults[4].document.inference.prediction.lineItems.length).to.be.equals(2);
    expect(receiptsResults[4].document.inference.prediction.lineItems[0].totalAmount).to.be.equals(10.5);
    expect(receiptsResults[4].document.inference.prediction.lineItems[1].totalAmount).to.be.equals(4);

    expect(receiptsResults[5].document.inference.prediction.lineItems.length).to.be.equals(0);
  }).timeout(60000);
});


describe("MindeeV1 - A Multi-Receipt Document", () => {
  before(async () => {
    sourceDoc = new PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "multi_receipts_detector/multipage_sample.pdf"),
    });
    await sourceDoc.init();
    client = new Client({ apiKey });
  });

  it("should send to the server and cut properly", async () => {
    const multiReceiptResult = await client.parse(MultiReceiptsDetectorV1, sourceDoc);
    expect(multiReceiptResult.document?.inference.prediction.receipts.length).to.be.equals(5);
    const extractedReceipts = await extractReceipts(sourceDoc, multiReceiptResult.document!.inference);
    expect(extractedReceipts.length).to.be.equals(5);
    expect(multiReceiptResult.document?.inference.pages[0].orientation?.value).to.be.equals(0);
    expect(multiReceiptResult.document?.inference.pages[1].orientation?.value).to.be.equals(0);
    const receiptsResults = [];
    for (const extractedReceipt of extractedReceipts) {
      const localInput = extractedReceipt.asSource();
      receiptsResults.push(await client.parse(ReceiptV5, localInput));
      await setTimeout(1000);
    }
    expect(receiptsResults[0].document.inference.prediction.lineItems.length).to.be.equals(5);
    expect(receiptsResults[0].document.inference.prediction.lineItems[0].totalAmount).to.be.equals(70);
    expect(receiptsResults[0].document.inference.prediction.lineItems[1].totalAmount).to.be.equals(12);
    expect(receiptsResults[0].document.inference.prediction.lineItems[2].totalAmount).to.be.equals(14);
    expect(receiptsResults[0].document.inference.prediction.lineItems[3].totalAmount).to.be.equals(11);
    expect(receiptsResults[0].document.inference.prediction.lineItems[4].totalAmount).to.be.equals(5.6);

    expect(receiptsResults[1].document.inference.prediction.lineItems.length).to.be.equals(7);
    expect(receiptsResults[1].document.inference.prediction.lineItems[0].totalAmount).to.be.equals(6);
    expect(receiptsResults[1].document.inference.prediction.lineItems[1].totalAmount).to.be.equals(11);
    expect(receiptsResults[1].document.inference.prediction.lineItems[2].totalAmount).to.be.equals(67.2);
    expect(receiptsResults[1].document.inference.prediction.lineItems[3].totalAmount).to.be.equals(19.2);
    expect(receiptsResults[1].document.inference.prediction.lineItems[4].totalAmount).to.be.equals(7);
    expect(receiptsResults[1].document.inference.prediction.lineItems[5].totalAmount).to.be.equals(5.5);
    expect(receiptsResults[1].document.inference.prediction.lineItems[6].totalAmount).to.be.equals(36);

    expect(receiptsResults[2].document.inference.prediction.lineItems.length).to.be.equals(1);
    expect(receiptsResults[2].document.inference.prediction.lineItems[0].totalAmount).to.be.equals(275);

    expect(receiptsResults[3].document.inference.prediction.lineItems.length).to.be.equals(2);
    expect(receiptsResults[3].document.inference.prediction.lineItems[0].totalAmount).to.be.equals(11.5);
    expect(receiptsResults[3].document.inference.prediction.lineItems[1].totalAmount).to.be.equals(2);

    expect(receiptsResults[4].document.inference.prediction.lineItems.length).to.be.equals(1);
    expect(receiptsResults[4].document.inference.prediction.lineItems[0].totalAmount).to.be.equals(16.5);


  }).timeout(60000);
});


describe("MindeeV1 - A Single-Receipt Image", () => {
  before(async () => {
    sourceDoc = new PathInput({
      inputPath: path.join(V1_PRODUCT_PATH, "expense_receipts/default_sample.jpg"),
    });
    await sourceDoc.init();
    client = new Client({ apiKey });
  });

  it("should send to the server and cut properly", async () => {
    const multiReceiptResult = await client.parse(MultiReceiptsDetectorV1, sourceDoc);
    expect(multiReceiptResult.document?.inference.prediction.receipts.length).to.be.equals(1);
    const receipts = await extractReceipts(sourceDoc, multiReceiptResult.document!.inference);
    expect(receipts.length).to.be.equals(1);
    const receiptResult = await client.parse(ReceiptV5, receipts[0].asSource());
    expect(receiptResult.document.inference.prediction.lineItems.length).to.be.equals(1);
    expect(receiptResult.document.inference.prediction.lineItems[0].totalAmount).to.be.equals(10.2);
    receipts[0].saveToFile(path.join(RESOURCE_PATH, "output/debug_taxes.pdf"));
    await receipts[0].saveToFileAsync(path.join(RESOURCE_PATH, "output/debug_taxes.jpg"));
    expect(receiptResult.document.inference.prediction.taxes.length).to.be.equals(1);
    expect(receiptResult.document.inference.prediction.taxes[0].value).to.be.equals(1.7);
  }).timeout(60000);
});
