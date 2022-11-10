import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import { dataPath } from "../../apiPaths";
import { ShippingContainerV1 } from "../../../src/documents";

describe("Shipping container V1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(
      path.resolve(dataPath.shippingContainerV1.empty)
    );
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new ShippingContainerV1({
      prediction: response.document.inference.pages[0].prediction,
    });
    expect(doc.owner.value).to.be.undefined;
    expect(doc.serialNumber.value).to.be.undefined;
    expect(doc.sizeType.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(
      path.resolve(dataPath.shippingContainerV1.complete)
    );
    const response = JSON.parse(jsonData.toString());
    const prediction = response.document.inference.prediction;
    const doc = new ShippingContainerV1({
      prediction: prediction,
    });
    const docString = await fs.readFile(
      path.join(dataPath.shippingContainerV1.docString)
    );
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
