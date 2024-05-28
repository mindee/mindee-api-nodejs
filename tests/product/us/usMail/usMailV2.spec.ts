import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/us_mail/response_v2/complete.json",
  empty: "tests/data/products/us_mail/response_v2/empty.json",
  docString: "tests/data/products/us_mail/response_v2/summary_full.rst",
  page0String: "tests/data/products/us_mail/response_v2/summary_page0.rst",
};

describe("UsMailV2 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.UsMailV2, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.senderName.value).to.be.undefined;
    expect(docPrediction.senderAddress.city).to.be.undefined;
    expect(docPrediction.senderAddress.complete).to.be.undefined;
    expect(docPrediction.senderAddress.postalCode).to.be.undefined;
    expect(docPrediction.senderAddress.state).to.be.undefined;
    expect(docPrediction.senderAddress.street).to.be.undefined;
    expect(docPrediction.recipientNames.length).to.be.equals(0);
    expect(docPrediction.recipientAddresses.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.UsMailV2, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
