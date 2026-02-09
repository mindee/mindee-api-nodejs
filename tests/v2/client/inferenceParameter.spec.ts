import { StringDict } from "@/parsing/index.js";
import path from "path";
import { V2_PRODUCT_PATH } from "../../index.js";
import { expect } from "chai";
import { promises as fs } from "fs";
import { ExtractionParameters, DataSchema } from "@/v2/product/extraction/index.js";

let expectedDataSchemaDict: StringDict;
let expectedDataSchemaString: string;
let expectedDataSchemaObject: DataSchema;

describe("MindeeV2 - Inference Parameter", () => {
  const modelIdValue = "test-model-id";

  describe("Polling Options", () => {
    it("should provide sensible defaults", () => {

      const paramsInstance = new ExtractionParameters({
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
      expectedDataSchemaObject = new DataSchema(expectedDataSchemaDict);
    });

    it("shouldn't replace when unset", () => {
      const params = new ExtractionParameters({
        modelId: modelIdValue,
      });
      expect(params.dataSchema).to.be.undefined;
    });

    it("should equate no matter the type", () => {
      const paramsDict = new ExtractionParameters({
        modelId: modelIdValue,
        dataSchema: expectedDataSchemaDict,
      });
      const paramsString = new ExtractionParameters({
        modelId: modelIdValue,
        dataSchema: expectedDataSchemaString,
      });
      const paramsObject = new ExtractionParameters({
        modelId: modelIdValue,
        dataSchema: expectedDataSchemaObject,
      });

      expect(JSON.stringify(paramsDict.dataSchema)).to.eq(expectedDataSchemaString);
      expect(paramsObject.dataSchema?.toString()).to.eq(expectedDataSchemaString);
      expect(paramsString.dataSchema?.toString()).to.eq(expectedDataSchemaString);
    });
  });
});
