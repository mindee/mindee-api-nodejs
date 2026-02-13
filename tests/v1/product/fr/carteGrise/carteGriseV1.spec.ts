import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { promises as fs } from "fs";
import * as mindee from "@/index.js";
import { V1_PRODUCT_PATH } from "../../../../index.js";

const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "carte_grise/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "carte_grise/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "carte_grise/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "carte_grise/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - CarteGriseV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.fr.CarteGriseV1, response.document);
    const docPrediction = doc.inference.prediction;
    assert.strictEqual(docPrediction.a.value, undefined);
    assert.strictEqual(docPrediction.b.value, undefined);
    assert.strictEqual(docPrediction.c1.value, undefined);
    assert.strictEqual(docPrediction.c3.value, undefined);
    assert.strictEqual(docPrediction.c41.value, undefined);
    assert.strictEqual(docPrediction.c4A.value, undefined);
    assert.strictEqual(docPrediction.d1.value, undefined);
    assert.strictEqual(docPrediction.d3.value, undefined);
    assert.strictEqual(docPrediction.e.value, undefined);
    assert.strictEqual(docPrediction.f1.value, undefined);
    assert.strictEqual(docPrediction.f2.value, undefined);
    assert.strictEqual(docPrediction.f3.value, undefined);
    assert.strictEqual(docPrediction.g.value, undefined);
    assert.strictEqual(docPrediction.g1.value, undefined);
    assert.strictEqual(docPrediction.i.value, undefined);
    assert.strictEqual(docPrediction.j.value, undefined);
    assert.strictEqual(docPrediction.j1.value, undefined);
    assert.strictEqual(docPrediction.j2.value, undefined);
    assert.strictEqual(docPrediction.j3.value, undefined);
    assert.strictEqual(docPrediction.p1.value, undefined);
    assert.strictEqual(docPrediction.p2.value, undefined);
    assert.strictEqual(docPrediction.p3.value, undefined);
    assert.strictEqual(docPrediction.p6.value, undefined);
    assert.strictEqual(docPrediction.q.value, undefined);
    assert.strictEqual(docPrediction.s1.value, undefined);
    assert.strictEqual(docPrediction.s2.value, undefined);
    assert.strictEqual(docPrediction.u1.value, undefined);
    assert.strictEqual(docPrediction.u2.value, undefined);
    assert.strictEqual(docPrediction.v7.value, undefined);
    assert.strictEqual(docPrediction.x1.value, undefined);
    assert.strictEqual(docPrediction.y1.value, undefined);
    assert.strictEqual(docPrediction.y2.value, undefined);
    assert.strictEqual(docPrediction.y3.value, undefined);
    assert.strictEqual(docPrediction.y4.value, undefined);
    assert.strictEqual(docPrediction.y5.value, undefined);
    assert.strictEqual(docPrediction.y6.value, undefined);
    assert.strictEqual(docPrediction.formulaNumber.value, undefined);
    assert.strictEqual(docPrediction.ownerFirstName.value, undefined);
    assert.strictEqual(docPrediction.ownerSurname.value, undefined);
    assert.strictEqual(docPrediction.mrz1.value, undefined);
    assert.strictEqual(docPrediction.mrz2.value, undefined);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.v1.Document(mindee.v1.product.fr.CarteGriseV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });
});
