import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../../index.js";
import { expect } from "chai";
import * as mindee from "@/index.js";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "energy_bill_fra/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "energy_bill_fra/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "energy_bill_fra/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "energy_bill_fra/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - EnergyBillV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.fr.EnergyBillV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.invoiceNumber.value).to.be.undefined;
    expect(docPrediction.contractId.value).to.be.undefined;
    expect(docPrediction.deliveryPoint.value).to.be.undefined;
    expect(docPrediction.invoiceDate.value).to.be.undefined;
    expect(docPrediction.dueDate.value).to.be.undefined;
    expect(docPrediction.totalBeforeTaxes.value).to.be.undefined;
    expect(docPrediction.totalTaxes.value).to.be.undefined;
    expect(docPrediction.totalAmount.value).to.be.undefined;
    expect(docPrediction.energySupplier.address).to.be.null;
    expect(docPrediction.energySupplier.name).to.be.null;
    expect(docPrediction.energyConsumer.address).to.be.null;
    expect(docPrediction.energyConsumer.name).to.be.null;
    expect(docPrediction.subscription.length).to.be.equals(0);
    expect(docPrediction.energyUsage.length).to.be.equals(0);
    expect(docPrediction.taxesAndContributions.length).to.be.equals(0);
    expect(docPrediction.meterDetails.meterNumber).to.be.null;
    expect(docPrediction.meterDetails.meterType).to.be.null;
    expect(docPrediction.meterDetails.unit).to.be.null;
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.fr.EnergyBillV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
