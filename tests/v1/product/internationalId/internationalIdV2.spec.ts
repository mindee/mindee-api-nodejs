import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../index.js";
import assert from "node:assert/strict";
import * as mindee from "@/index.js";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "international_id/response_v2/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "international_id/response_v2/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "international_id/response_v2/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "international_id/response_v2/summary_page0.rst"),
};

describe("MindeeV1 - InternationalIdV2 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.InternationalIdV2, response.document);
    const docPrediction = doc.inference.prediction;
    assert.strictEqual(docPrediction.documentNumber.value, undefined);
    assert.strictEqual(docPrediction.surnames.length, 0);
    assert.strictEqual(docPrediction.givenNames.length, 0);
    assert.strictEqual(docPrediction.sex.value, undefined);
    assert.strictEqual(docPrediction.birthDate.value, undefined);
    assert.strictEqual(docPrediction.birthPlace.value, undefined);
    assert.strictEqual(docPrediction.nationality.value, undefined);
    assert.strictEqual(docPrediction.personalNumber.value, undefined);
    assert.strictEqual(docPrediction.countryOfIssue.value, undefined);
    assert.strictEqual(docPrediction.stateOfIssue.value, undefined);
    assert.strictEqual(docPrediction.issueDate.value, undefined);
    assert.strictEqual(docPrediction.expiryDate.value, undefined);
    assert.strictEqual(docPrediction.address.value, undefined);
    assert.strictEqual(docPrediction.mrzLine1.value, undefined);
    assert.strictEqual(docPrediction.mrzLine2.value, undefined);
    assert.strictEqual(docPrediction.mrzLine3.value, undefined);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.InternationalIdV2, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });
});
