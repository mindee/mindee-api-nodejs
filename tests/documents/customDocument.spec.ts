import { promises as fs } from "fs";
import * as path from "path";
import { CustomDocument } from "../../src/documents";
import { expect } from "chai";
import { dataPath } from "../apiPaths";

describe("Custom Document Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(
      path.resolve(dataPath.custom.complete)
    );
    const response = JSON.parse(jsonDataNA.toString());
    const custom = new CustomDocument({
      apiPrediction: response.document.inference.pages[0].prediction,
      documentType: "field_test",
    });
    expect(custom.internalDocType).to.be.equals("field_test");
    expect(Object.keys(custom.fields).length).to.be.equals(10);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.custom.complete));
    const response = JSON.parse(jsonData.toString());
    const custom = new CustomDocument({
      apiPrediction: response.document.inference.prediction,
      documentType: "field_test",
    });
    const docString = await fs.readFile(path.join(dataPath.custom.docString));
    expect(custom.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.custom.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const custom = new CustomDocument({
      apiPrediction: pageData.prediction,
      documentType: "field_test",
      pageId: pageData.id,
    });
    const docString = await fs.readFile(path.join(dataPath.custom.page0String));
    expect(custom.toString()).to.be.equals(docString.toString());
  });

  it("should load a complete page 1 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.custom.complete));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[1];
    const custom = new CustomDocument({
      apiPrediction: pageData.prediction,
      documentType: "field_test",
      pageId: pageData.id,
    });
    const docString = await fs.readFile(path.join(dataPath.custom.page1String));
    expect(custom.toString()).to.be.equals(docString.toString());
  });
});
