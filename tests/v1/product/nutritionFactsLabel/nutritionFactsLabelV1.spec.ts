import { promises as fs } from "fs";
import path from "path";
import { V1_PRODUCT_PATH } from "../../../index";
import { expect } from "chai";
import * as mindee from "../../../../src";


const dataPath = {
  complete: path.join(V1_PRODUCT_PATH, "nutrition_facts/response_v1/complete.json"),
  empty: path.join(V1_PRODUCT_PATH, "nutrition_facts/response_v1/empty.json"),
  docString: path.join(V1_PRODUCT_PATH, "nutrition_facts/response_v1/summary_full.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "nutrition_facts/response_v1/summary_page0.rst"),
};

describe("MindeeV1 - NutritionFactsLabelV1 Object initialization", async () => {
  it("should load an empty document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.empty));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.NutritionFactsLabelV1, response.document);
    const docPrediction = doc.inference.prediction;
    expect(docPrediction.servingPerBox.value).to.be.undefined;
    expect(docPrediction.servingSize.amount).to.be.null;
    expect(docPrediction.servingSize.unit).to.be.null;
    expect(docPrediction.calories.dailyValue).to.be.null;
    expect(docPrediction.calories.per100G).to.be.null;
    expect(docPrediction.calories.perServing).to.be.null;
    expect(docPrediction.totalFat.dailyValue).to.be.null;
    expect(docPrediction.totalFat.per100G).to.be.null;
    expect(docPrediction.totalFat.perServing).to.be.null;
    expect(docPrediction.saturatedFat.dailyValue).to.be.null;
    expect(docPrediction.saturatedFat.per100G).to.be.null;
    expect(docPrediction.saturatedFat.perServing).to.be.null;
    expect(docPrediction.transFat.dailyValue).to.be.null;
    expect(docPrediction.transFat.per100G).to.be.null;
    expect(docPrediction.transFat.perServing).to.be.null;
    expect(docPrediction.cholesterol.dailyValue).to.be.null;
    expect(docPrediction.cholesterol.per100G).to.be.null;
    expect(docPrediction.cholesterol.perServing).to.be.null;
    expect(docPrediction.totalCarbohydrate.dailyValue).to.be.null;
    expect(docPrediction.totalCarbohydrate.per100G).to.be.null;
    expect(docPrediction.totalCarbohydrate.perServing).to.be.null;
    expect(docPrediction.dietaryFiber.dailyValue).to.be.null;
    expect(docPrediction.dietaryFiber.per100G).to.be.null;
    expect(docPrediction.dietaryFiber.perServing).to.be.null;
    expect(docPrediction.totalSugars.dailyValue).to.be.null;
    expect(docPrediction.totalSugars.per100G).to.be.null;
    expect(docPrediction.totalSugars.perServing).to.be.null;
    expect(docPrediction.addedSugars.dailyValue).to.be.null;
    expect(docPrediction.addedSugars.per100G).to.be.null;
    expect(docPrediction.addedSugars.perServing).to.be.null;
    expect(docPrediction.protein.dailyValue).to.be.null;
    expect(docPrediction.protein.per100G).to.be.null;
    expect(docPrediction.protein.perServing).to.be.null;
    expect(docPrediction.sodium.dailyValue).to.be.null;
    expect(docPrediction.sodium.per100G).to.be.null;
    expect(docPrediction.sodium.perServing).to.be.null;
    expect(docPrediction.sodium.unit).to.be.null;
    expect(docPrediction.nutrients.length).to.be.equals(0);
  });

  it("should load a complete document prediction", async () => {
    const jsonData = await fs.readFile(path.resolve(dataPath.complete));
    const response = JSON.parse(jsonData.toString());
    const doc = new mindee.Document(mindee.product.NutritionFactsLabelV1, response.document);
    const docString = await fs.readFile(path.join(dataPath.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
