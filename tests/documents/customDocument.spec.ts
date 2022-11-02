import { promises as fs } from "fs";
import * as path from "path";
import { CustomV1 } from "../../src/documents";
import { expect } from "chai";
import { dataPath } from "../apiPaths";

describe("Custom Document Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(
      path.resolve(dataPath.custom.complete)
    );
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new CustomV1({
      prediction: response.document.inference.prediction,
      documentType: "field_test",
    });
    expect(doc.docType).to.be.equals("field_test");
    expect(doc.fields.size).to.be.equals(10);
    expect(doc.classifications.size).to.be.equals(1);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.custom.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new CustomV1({
      prediction: response.document.inference.prediction,
      documentType: "field_test",
    });
    const stringAll = doc.fields.get("string_all");
    expect(stringAll).to.have.property("values");
    expect(stringAll?.contentsString("-")).to.equals("Mindee-is-awesome");
    expect(stringAll?.contentsList()).to.have.members([
      "Mindee",
      "is",
      "awesome",
    ]);
    expect(doc.classifications.get("doc_type")).to.have.property("value");
    expect(doc.fields.size).to.be.equals(10);
    expect(doc.classifications.size).to.be.equals(1);
    const docString = await fs.readFile(path.join(dataPath.custom.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.custom.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const doc = new CustomV1({
      prediction: pageData.prediction,
      documentType: "field_test",
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    expect(doc.orientation?.value).to.be.equals(0);
    expect(doc.cropper.length).to.be.equals(1);
    const docString = await fs.readFile(path.join(dataPath.custom.page0String));
    expect(doc.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 1 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.custom.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[1];
    const doc = new CustomV1({
      prediction: pageData.prediction,
      documentType: "field_test",
      pageId: pageData.id,
      orientation: pageData.orientation,
      extras: pageData.extras,
    });
    expect(doc.orientation?.value).to.be.equals(0);
    const docString = await fs.readFile(path.join(dataPath.custom.page1String));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
