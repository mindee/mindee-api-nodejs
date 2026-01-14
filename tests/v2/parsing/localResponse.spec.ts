import * as fs from "node:fs/promises";
import { expect } from "chai";
import { InferenceResponse, LocalResponse } from "@/v2/index.js";

import path from "path";
import { V2_RESOURCE_PATH } from "../../index.js";
import { Buffer } from "node:buffer";

const signature: string = "1df388c992d87897fe61dfc56c444c58fc3c7369c31e2b5fd20d867695e93e85";
const dummySecretKey: string = "ogNjY44MhvKPGTtVsI8zG82JqWQa68woYQH";
const filePath: string = path.join(V2_RESOURCE_PATH, "inference/standard_field_types.json");

async function assertLocalResponse(localResponse: LocalResponse) {
  await localResponse.init();
  expect(localResponse.asDict()).to.not.be.null;
  expect(localResponse.isValidHmacSignature(dummySecretKey, "invalid signature")).to.be.false;
  expect(localResponse.getHmacSignature(dummySecretKey)).to.eq(signature);
  expect(localResponse.isValidHmacSignature(dummySecretKey, signature)).to.be.true;
  const inferenceResponse = await localResponse.deserializeResponse(InferenceResponse);
  expect(inferenceResponse).to.be.an.instanceof(InferenceResponse);
  expect(inferenceResponse.inference).to.not.be.null;
}

describe("MindeeV2 - Load Local Response", () => {
  it("should load a string properly.", async () => {
    const fileObj = await fs.readFile(filePath, { encoding: "utf-8" });
    await assertLocalResponse(new LocalResponse(fileObj));
  });

  it("should load a file properly.", async () => {
    await assertLocalResponse(new LocalResponse(filePath));
  });

  it("should load a buffer properly.", async () => {
    const fileStr = (await fs.readFile(filePath, { encoding: "utf-8" })).replace(/\r/g, "").replace(/\n/g, "");
    const fileBuffer = Buffer.from(fileStr, "utf-8");
    await assertLocalResponse(new LocalResponse(fileBuffer));
  });

  it("should deserialize a prediction.", async () => {
    const fileObj = await fs.readFile(filePath, { encoding: "utf-8" });
    const localResponse = new LocalResponse(fileObj);
    const response = await localResponse.deserializeResponse(InferenceResponse);
    expect(response).to.be.an.instanceof(InferenceResponse);

    expect(JSON.stringify(response.getRawHttp())).to.eq(JSON.stringify(JSON.parse(fileObj)));
  });
});
