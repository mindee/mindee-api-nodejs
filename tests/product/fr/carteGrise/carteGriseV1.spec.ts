import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/carte_grise/response_v1/complete.json",
  empty: "tests/data/products/carte_grise/response_v1/empty.json",
  docString: "tests/data/products/carte_grise/response_v1/summary_full.rst",
  page0String: "tests/data/products/carte_grise/response_v1/summary_page0.rst",
};

describe("CarteGriseV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.fr.CarteGriseV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.a.value).to.be.undefined;
    expect(docPrediction.b.value).to.be.undefined;
    expect(docPrediction.c1.value).to.be.undefined;
    expect(docPrediction.c3.value).to.be.undefined;
    expect(docPrediction.c41.value).to.be.undefined;
    expect(docPrediction.c4A.value).to.be.undefined;
    expect(docPrediction.d1.value).to.be.undefined;
    expect(docPrediction.d3.value).to.be.undefined;
    expect(docPrediction.e.value).to.be.undefined;
    expect(docPrediction.f1.value).to.be.undefined;
    expect(docPrediction.f2.value).to.be.undefined;
    expect(docPrediction.f3.value).to.be.undefined;
    expect(docPrediction.g.value).to.be.undefined;
    expect(docPrediction.g1.value).to.be.undefined;
    expect(docPrediction.i.value).to.be.undefined;
    expect(docPrediction.j.value).to.be.undefined;
    expect(docPrediction.j1.value).to.be.undefined;
    expect(docPrediction.j2.value).to.be.undefined;
    expect(docPrediction.j3.value).to.be.undefined;
    expect(docPrediction.p1.value).to.be.undefined;
    expect(docPrediction.p2.value).to.be.undefined;
    expect(docPrediction.p3.value).to.be.undefined;
    expect(docPrediction.p6.value).to.be.undefined;
    expect(docPrediction.q.value).to.be.undefined;
    expect(docPrediction.s1.value).to.be.undefined;
    expect(docPrediction.s2.value).to.be.undefined;
    expect(docPrediction.u1.value).to.be.undefined;
    expect(docPrediction.u2.value).to.be.undefined;
    expect(docPrediction.v7.value).to.be.undefined;
    expect(docPrediction.x1.value).to.be.undefined;
    expect(docPrediction.y1.value).to.be.undefined;
    expect(docPrediction.y2.value).to.be.undefined;
    expect(docPrediction.y3.value).to.be.undefined;
    expect(docPrediction.y4.value).to.be.undefined;
    expect(docPrediction.y5.value).to.be.undefined;
    expect(docPrediction.y6.value).to.be.undefined;
    expect(docPrediction.formulaNumber.value).to.be.undefined;
    expect(docPrediction.ownerFirstName.value).to.be.undefined;
    expect(docPrediction.ownerSurname.value).to.be.undefined;
    expect(docPrediction.mrz1.value).to.be.undefined;
    expect(docPrediction.mrz2.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.fr.CarteGriseV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
