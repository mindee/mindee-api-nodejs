import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";


const dataPath = {
  complete: "tests/data/products/delivery_notes/response_v1/complete.json",
  empty: "tests/data/products/delivery_notes/response_v1/empty.json",
  docString: "tests/data/products/delivery_notes/response_v1/summary_full.rst",
  page0String: "tests/data/products/delivery_notes/response_v1/summary_page0.rst",
};

describe("DeliveryNoteV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.DeliveryNoteV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.deliveryDate.value).to.be.undefined;
    expect(docPrediction.deliveryNumber.value).to.be.undefined;
    expect(docPrediction.supplierName.value).to.be.undefined;
    expect(docPrediction.supplierAddress.value).to.be.undefined;
    expect(docPrediction.customerName.value).to.be.undefined;
    expect(docPrediction.customerAddress.value).to.be.undefined;
    expect(docPrediction.totalAmount.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.DeliveryNoteV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});