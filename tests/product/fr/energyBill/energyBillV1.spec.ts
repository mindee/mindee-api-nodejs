import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: "tests/data/products/energy_bill_fra/response_v1/complete.json",
  empty: "tests/data/products/energy_bill_fra/response_v1/empty.json",
  docString: "tests/data/products/energy_bill_fra/response_v1/summary_full.rst",
  page0String: "tests/data/products/energy_bill_fra/response_v1/summary_page0.rst",
};

describe("EnergyBillV1 Object initialization", async () => {
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
