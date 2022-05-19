import { promises as fs } from "fs";
import path from "path";
import { CustomDocument } from "../../mindee/documents";
import { expect } from "chai";
import * as api_path from "../data/apiPaths.json";

describe("Custom Document Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(api_path.customs.all_na));
    const response = JSON.parse(jsonDataNA.toString());
    const custom = new CustomDocument({
      prediction: response.document.inference.pages[0].prediction,
      documentType: "field_test",
    });

    expect(custom.documentType).to.be.equals("field_test");
    expect(Object.keys(custom.fields).length).to.be.equals(10);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.customs.all));
    const response = JSON.parse(jsonData.toString());
    const custom = new CustomDocument({
      prediction: response.document.inference.prediction,
      documentType: "field_test",
    });
    const to_string = await fs.readFile(
      path.join(api_path.customs.docToString)
    );

    expect(custom.toString()).to.be.equals(to_string.toString());
  });

  it("should load a complete page 0 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.customs.all));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[0];
    const custom = new CustomDocument({
      prediction: pageData.prediction,
      documentType: "field_test",
      pageId: pageData.id,
    });
    const to_string = await fs.readFile(
      path.join(api_path.customs.page0ToString)
    );

    expect(custom.toString()).to.be.equals(to_string.toString());
  });

  it("should load a complete page 1 prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(api_path.customs.all));
    const response = JSON.parse(jsonData.toString());
    const pageData = response.document.inference.pages[1];
    const custom = new CustomDocument({
      prediction: pageData.prediction,
      documentType: "field_test",
      pageId: pageData.id,
    });
    const to_string = await fs.readFile(
      path.join(api_path.customs.page1ToString)
    );

    expect(custom.toString()).to.be.equals(to_string.toString());
  });
});
