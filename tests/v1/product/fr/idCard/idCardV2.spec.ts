import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { promises as fs } from "fs";
import * as mindee from "@/index.js";
import { V1_PRODUCT_PATH } from "../../../../index.js";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "idcard_fr/response_v2/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "idcard_fr/response_v2/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "idcard_fr/response_v2/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "idcard_fr/response_v2/summary_page0.rst"),
};

describe("MindeeV1 - IdCardV2 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.fr.IdCardV2, response.document);
    const docPrediction = doc.inference.prediction;
    assert.strictEqual(docPrediction.nationality.value, undefined);
    assert.strictEqual(docPrediction.cardAccessNumber.value, undefined);
    assert.strictEqual(docPrediction.documentNumber.value, undefined);
    assert.strictEqual(docPrediction.givenNames.length, 0);
    assert.strictEqual(docPrediction.surname.value, undefined);
    assert.strictEqual(docPrediction.alternateName.value, undefined);
    assert.strictEqual(docPrediction.birthDate.value, undefined);
    assert.strictEqual(docPrediction.birthPlace.value, undefined);
    assert.strictEqual(docPrediction.gender.value, undefined);
    assert.strictEqual(docPrediction.expiryDate.value, undefined);
    assert.strictEqual(docPrediction.mrz1.value, undefined);
    assert.strictEqual(docPrediction.mrz2.value, undefined);
    assert.strictEqual(docPrediction.mrz3.value, undefined);
    assert.strictEqual(docPrediction.issueDate.value, undefined);
    assert.strictEqual(docPrediction.authority.value, undefined);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.fr.IdCardV2, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });
  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.fr.IdCardV2, response.document);
    const page0 = doc.inference.pages[0];
    const docString = await fs.readFile(path.join(dataPath.page0String));
    assert.strictEqual(page0.toString(), docString.toString());
  });
});
