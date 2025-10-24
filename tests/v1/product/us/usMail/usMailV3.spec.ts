import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../../index";
import { expect } from "chai";
import * as mindee from "../../../../../src";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "us_mail/response_v3/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "us_mail/response_v3/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "us_mail/response_v3/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "us_mail/response_v3/summary_page0.rst"),
};

describe("MindeeV1 - UsMailV3 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.UsMailV3, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.senderName.value).to.be.undefined;
    expect(docPrediction.senderAddress.city).to.be.null;
    expect(docPrediction.senderAddress.complete).to.be.null;
    expect(docPrediction.senderAddress.postalCode).to.be.null;
    expect(docPrediction.senderAddress.state).to.be.null;
    expect(docPrediction.senderAddress.street).to.be.null;
    expect(docPrediction.recipientNames.length).to.be.equals(0);
    expect(docPrediction.recipientAddresses.length).to.be.equals(0);
    expect(docPrediction.isReturnToSender.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.us.UsMailV3, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
