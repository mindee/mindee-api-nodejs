import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../index";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "bill_of_lading/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "bill_of_lading/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "bill_of_lading/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "bill_of_lading/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - BillOfLadingV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.BillOfLadingV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.billOfLadingNumber.value).to.be.undefined;
    expect(docPrediction.shipper.address).to.be.null;
    expect(docPrediction.shipper.email).to.be.null;
    expect(docPrediction.shipper.name).to.be.null;
    expect(docPrediction.shipper.phone).to.be.null;
    expect(docPrediction.consignee.address).to.be.null;
    expect(docPrediction.consignee.email).to.be.null;
    expect(docPrediction.consignee.name).to.be.null;
    expect(docPrediction.consignee.phone).to.be.null;
    expect(docPrediction.notifyParty.address).to.be.null;
    expect(docPrediction.notifyParty.email).to.be.null;
    expect(docPrediction.notifyParty.name).to.be.null;
    expect(docPrediction.notifyParty.phone).to.be.null;
    expect(docPrediction.carrier.name).to.be.null;
    expect(docPrediction.carrier.professionalNumber).to.be.null;
    expect(docPrediction.carrier.scac).to.be.null;
    expect(docPrediction.carrierItems.length).to.be.equals(0);
    expect(docPrediction.portOfLoading.value).to.be.undefined;
    expect(docPrediction.portOfDischarge.value).to.be.undefined;
    expect(docPrediction.placeOfDelivery.value).to.be.undefined;
    expect(docPrediction.dateOfIssue.value).to.be.undefined;
    expect(docPrediction.departureDate.value).to.be.undefined;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.BillOfLadingV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
