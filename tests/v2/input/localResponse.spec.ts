import * as fs from "node:fs/promises";
import { expect } from "chai";
import { InferenceResponse, LocalResponse } from "../../../src";

import path from "path";
import { V2_RESOURCE_PATH } from "../../index";

const signature: string = "a1bc9012fa63539d602f163d8980604a0cf2b2ae88e56009cfa1db33382736cf";
const dummySecretKey: string = "ogNjY44MhvKPGTtVsI8zG82JqWQa68woYQH";
const filePath: string = path.join(V2_RESOURCE_PATH, "inference/standard_field_types.json");

describe("MindeeV2 - Load Local Response", () => {
  it("should load a string properly.", async () => {
    const fileObj = await fs.readFile(filePath, { encoding: "utf-8" });
    const localResponse = new LocalResponse(fileObj);
    await localResponse.init();
    expect(localResponse.asDict()).to.not.be.null;
    expect(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature")).to.be.false;
    expect(localResponse.getHmacSignature(dummySecretKey)).to.eq(signature);
    expect(localResponse.isValidHmacSignature(dummySecretKey, signature)).to.be.true;
  });

  it("should load a file properly.", async () => {
    const localResponse = new LocalResponse(filePath);
    await localResponse.init();
    expect(localResponse.asDict()).to.not.be.null;
    expect(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature")).to.be.false;
    expect(localResponse.getHmacSignature(dummySecretKey)).to.eq(signature);
    expect(localResponse.isValidHmacSignature(dummySecretKey, signature)).to.be.true;
  });

  it("should load a buffer properly.", async () => {
    const fileStr = (await fs.readFile(filePath, { encoding: "utf-8" })).replace(/\r/g, "").replace(/\n/g, "");
    const fileBuffer = Buffer.from(fileStr, "utf-8");
    const localResponse = new LocalResponse(fileBuffer);
    await localResponse.init();
    expect(localResponse.asDict()).to.not.be.null;
    expect(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature")).to.be.false;
    expect(localResponse.getHmacSignature(dummySecretKey)).to.eq(signature);
    expect(localResponse.isValidHmacSignature(dummySecretKey, signature)).to.be.true;
  });

  it("should deserialize a prediction.", async () => {
    const fileObj = await fs.readFile(filePath, { encoding: "utf-8" });
    const localResponse = new LocalResponse(fileObj);
    const response = await localResponse.deserializeResponse(InferenceResponse);
    expect(response).to.be.an.instanceof(InferenceResponse);

    expect(JSON.stringify(response.getRawHttp())).to.eq(JSON.stringify(JSON.parse(fileObj)));
  });
});
