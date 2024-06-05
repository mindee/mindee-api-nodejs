import {
  PathInput,
  PageOptionsOperation,
  INPUT_TYPE_PATH, LocalResponse,
} from "../../src/input";
import * as fs from "node:fs/promises";
import { expect } from "chai";

const signature: string = "5ed1673e34421217a5dbfcad905ee62261a3dd66c442f3edd19302072bbf70d0";
const dummySecretKey: string = "ogNjY44MhvKPGTtVsI8zG82JqWQa68woYQH";
const filePath: string = "tests/data/async/get_completed_empty.json";


describe("A valid local response", () => {
  it("should load a string properly.", async () => {
    const fileObj = await fs.readFile(filePath, {encoding: "utf-8"})
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
    const fileStr = (await fs.readFile(filePath, {encoding: "utf-8"})).replace(/\r/g, "").replace(/\n/g, "");
    const fileBuffer = Buffer.from(fileStr, "utf-8");
    const localResponse = new LocalResponse(fileBuffer);
    await localResponse.init();
    expect(localResponse.asDict()).to.not.be.null;
    expect(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature")).to.be.false;
    expect(localResponse.getHmacSignature(dummySecretKey)).to.eq(signature);
    expect(localResponse.isValidHmacSignature(dummySecretKey, signature)).to.be.true;
  });
});
