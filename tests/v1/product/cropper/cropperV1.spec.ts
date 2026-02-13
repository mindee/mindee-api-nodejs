import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../index.js";
import assert from "node:assert/strict";
import * as mindee from "@/index.js";

const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "cropper/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "cropper/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "cropper/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "cropper/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - CropperV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.CropperV1, response.document);
    const pagePrediction = doc.inference.pages[0].prediction;
    assert.strictEqual(pagePrediction.cropping.length, 0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.CropperV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.CropperV1, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0String));
    assert.strictEqual(page0.toString(), docString.toString());
  });
});
