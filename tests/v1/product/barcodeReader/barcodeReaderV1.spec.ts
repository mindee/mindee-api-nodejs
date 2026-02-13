import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { promises as fs } from "fs";
import * as mindee from "@/index.js";
import { V1_PRODUCT_PATH } from "../../../index.js";

const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "barcode_reader/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "barcode_reader/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "barcode_reader/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "barcode_reader/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - BarcodeReaderV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.BarcodeReaderV1, response.document);
    const docPrediction = doc.inference.prediction;
    assert.strictEqual(docPrediction.codes1D.length, 0);
    assert.strictEqual(docPrediction.codes2D.length, 0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.BarcodeReaderV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });
});
