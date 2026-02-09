import { StringDict } from "@/parsing/index.js";
import path from "path";
import { V2_PRODUCT_PATH } from "../../index.js";
import { expect } from "chai";
import { promises as fs } from "fs";
import { extraction } from "@/v2/product/index.js";

let expectedDataSchemaDict: StringDict;
let expectedDataSchemaString: string;
let expectedDataSchemaObject: extraction.DataSchema;

describe("MindeeV2 - Extraction Parameter", () => {
  const modelIdValue = "test-model-id";

  describe("Polling Options", () => {
    it("should provide sensible defaults", () => {

      const paramsInstance = new extraction.ExtractionParameters({
        modelId: modelIdValue,
      });
      expect(paramsInstance.modelId).to.equal(modelIdValue);
      expect(paramsInstance.getValidatedPollingOptions()).to.deep.equal({
        delaySec: 1.5,
        initialDelaySec: 2,
        maxRetries: 80
      });
    });
  });

  describe("Data Schema", () => {
    before(async () => {
      const fileContents = await fs.readFile(
        path.join(V2_PRODUCT_PATH, "extraction/data_schema_replace_param.json")
      );
      expectedDataSchemaDict = JSON.parse(fileContents.toString());
      expectedDataSchemaString = JSON.stringify(expectedDataSchemaDict);
      expectedDataSchemaObject = new extraction.DataSchema(expectedDataSchemaDict);
    });

    it("shouldn't replace when unset", () => {
      const params = new extraction.ExtractionParameters({
        modelId: modelIdValue,
      });
      expect(params.dataSchema).to.be.undefined;
    });

    it("should equate no matter the type", () => {
      const paramsDict = new extraction.ExtractionParameters({
        modelId: modelIdValue,
        dataSchema: expectedDataSchemaDict,
      });
      const paramsString = new extraction.ExtractionParameters({
        modelId: modelIdValue,
        dataSchema: expectedDataSchemaString,
      });
      const paramsObject = new extraction.ExtractionParameters({
        modelId: modelIdValue,
        dataSchema: expectedDataSchemaObject,
      });

      expect(JSON.stringify(paramsDict.dataSchema)).to.eq(expectedDataSchemaString);
      expect(paramsObject.dataSchema?.toString()).to.eq(expectedDataSchemaString);
      expect(paramsString.dataSchema?.toString()).to.eq(expectedDataSchemaString);
    });
  });
});
