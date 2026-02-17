import path from "path";
import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { promises as fs } from "fs";
import { StringDict } from "@/parsing/index.js";
import { V2_PRODUCT_PATH } from "../../index.js";
import { extraction } from "@/v2/product/index.js";

let expectedDataSchemaDict: StringDict;
let expectedDataSchemaString: string;
let expectedDataSchemaObject: extraction.params.DataSchema;

describe("MindeeV2 - Extraction Parameter", () => {
  const modelIdValue = "test-model-id";

  describe("Polling Options", () => {
    it("should provide sensible defaults", () => {

      const paramsInstance = new extraction.ExtractionParameters({
        modelId: modelIdValue,
      });
      assert.strictEqual(paramsInstance.modelId, modelIdValue);
    });
  });

  describe("Data Schema", () => {
    before(async () => {
      const fileContents = await fs.readFile(
        path.join(V2_PRODUCT_PATH, "extraction/data_schema_replace_param.json")
      );
      expectedDataSchemaDict = JSON.parse(fileContents.toString());
      expectedDataSchemaString = JSON.stringify(expectedDataSchemaDict);
      expectedDataSchemaObject = new extraction.params.DataSchema(expectedDataSchemaDict);
    });

    it("shouldn't replace when unset", () => {
      const params = new extraction.ExtractionParameters({
        modelId: modelIdValue,
      });
      assert.strictEqual(params.dataSchema, undefined);
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

      assert.strictEqual(JSON.stringify(paramsDict.dataSchema), expectedDataSchemaString);
      assert.strictEqual(paramsObject.dataSchema?.toString(), expectedDataSchemaString);
      assert.strictEqual(paramsString.dataSchema?.toString(), expectedDataSchemaString);
    });
  });
});
