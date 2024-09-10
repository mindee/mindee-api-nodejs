import {LocalResponse,} from "../../src";
import * as fs from "node:fs/promises";
import {expect} from "chai";
import {Client, PredictResponse, AsyncPredictResponse} from "../../src";
import {InternationalIdV2, InvoiceV4} from "../../src/product";

const signature: string = "5ed1673e34421217a5dbfcad905ee62261a3dd66c442f3edd19302072bbf70d0";
const dummySecretKey: string = "ogNjY44MhvKPGTtVsI8zG82JqWQa68woYQH";
const filePath: string = "tests/data/async/get_completed_empty.json";
const invoicePath: string = "tests/data/products/invoices/response_v4/complete.json";
const internationalIdPath: string = "tests/data/products/international_id/response_v2/complete.json";


describe("A valid local response", () => {
  it("should load a string properly.", async () => {
    const fileObj = await fs.readFile(filePath, { encoding: "utf-8" })
    const localResponse = new LocalResponse(fileObj);
    await localResponse.init();
    expect(localResponse.asDict()).to.not.be.null;
    expect(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature")).to.be.false;
    expect(localResponse.getHmacSignature(dummySecretKey)).to.eq(signature);
    expect(localResponse.isValidHmacSignature(dummySecretKey, signature)).to.be.true;
  });

  it('should load a file properly.', async () => {
    const localResponse = new LocalResponse(filePath);
    await localResponse.init();
    expect(localResponse.asDict()).to.not.be.null;
    expect(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature")).to.be.false;
    expect(localResponse.getHmacSignature(dummySecretKey)).to.eq(signature);
    expect(localResponse.isValidHmacSignature(dummySecretKey, signature)).to.be.true;
  });

  it('should load a file properly.', async () => {
    const fileStr = (await fs.readFile(filePath, { encoding: "utf-8" })).replace(/\r/g, "").replace(/\n/g, "");
    const fileBuffer = Buffer.from(fileStr, "utf-8");
    const localResponse = new LocalResponse(fileBuffer);
    await localResponse.init();
    expect(localResponse.asDict()).to.not.be.null;
    expect(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature")).to.be.false;
    expect(localResponse.getHmacSignature(dummySecretKey)).to.eq(signature);
    expect(localResponse.isValidHmacSignature(dummySecretKey, signature)).to.be.true;
  });

  it('should load into a sync prediction.', async () => {
    const fileObj = await fs.readFile(invoicePath, { encoding: "utf-8" })
    const localResponse = new LocalResponse(fileObj);
    await localResponse.init();
    const dummyClient = new Client({ apiKey: "dummy-key" });
    const prediction = await dummyClient.loadPrediction(InvoiceV4, localResponse);
    expect(prediction).to.be.an.instanceof(PredictResponse);

    expect(JSON.stringify(prediction.getRawHttp())).to.eq(JSON.stringify(JSON.parse(fileObj)));
  });

  it('should load into an async prediction.', async () => {
    const fileObj = await fs.readFile(internationalIdPath, { encoding: "utf-8" })
    const localResponse = new LocalResponse(fileObj);
    await localResponse.init();
    const dummyClient = new Client({ apiKey: "dummy-key" });
    const prediction = await dummyClient.loadPrediction(InternationalIdV2, localResponse);
    expect(prediction).to.be.an.instanceof(AsyncPredictResponse);

    expect(JSON.stringify(prediction.getRawHttp())).to.eq(JSON.stringify(JSON.parse(fileObj)));
  });
});
