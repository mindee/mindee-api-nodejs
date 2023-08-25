import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";
import { CustomV1Document } from "../../../src/product/custom/customV1Document";
import { Page } from "../../../src/parsing/common";
import { CropperExtra } from "../../../src/parsing/common/extras/cropperExtra";
import { CustomV1 } from "../../../src/product";

const dataPath = {
  complete: "tests/data/products/custom/response_v1/complete.json",
  empty: "tests/data/products/custom/response_v1/empty.json",
  docString: "tests/data/products/custom/response_v1/summary_full.rst",
  page0String: "tests/data/products/custom/response_v1/summary_page0.rst",
  page1String: "tests/data/products/custom/response_v1/summary_page1.rst",
};

describe("Custom Document Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new CustomV1(response.document.inference);
    expect(doc.product.name).to.be.equals("ianare/field_test");
    expect(doc.prediction.fields.size).to.be.equals(10);
    expect(doc.prediction.classifications.size).to.be.equals(1);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(CustomV1, response.document);
    const docInference = doc.inference.prediction as CustomV1Document;
    const stringAll = docInference.fields.get("string_all");
    expect(stringAll).to.have.property("values");
    expect(stringAll?.contentsString("-")).to.equals("Mindee-is-awesome");
    expect(stringAll?.contentsList()).to.have.members([
      "Mindee",
      "is",
      "awesome",
    ]);
    expect(docInference.classifications.get("doc_type")).to.have.property("value");
    expect(docInference.fields.size).to.be.equals(10);
    expect(docInference.classifications.size).to.be.equals(1);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(CustomV1, response.document);
    const page0: Page<CustomV1Document> = doc.inference?.pages[0] as Page<CustomV1Document>;
    expect(page0.orientation?.value).to.be.equals(0);
    expect((page0?.extras && page0?.extras["cropper"] as CropperExtra)?.cropping.length).to.be.equals(1);
    const pageString = await fs.readFile(path.join(dataPath.page0String));
    expect(page0.toString()).to.be.equals(pageString.toString());
  });

  it("should load a complete page 1 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(CustomV1, response.document);
    const page1: Page<CustomV1Document> = doc.inference?.pages[1] as Page<CustomV1Document>;
    expect(page1.orientation?.value).to.be.equals(0);
    const pageString = await fs.readFile(path.join(dataPath.page1String));
    expect(page1.toString()).to.be.equals(pageString.toString());
  });
});
