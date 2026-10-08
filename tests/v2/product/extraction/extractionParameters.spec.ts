import path from "node:path";
import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { promises as fs } from "node:fs";
import { StringDict } from "@/parsing/index.js";
import { V2_PRODUCT_PATH } from "../../../index.js";
import { extraction } from "@/v2/product/index.js";

let expectedDataSchemaDict: StringDict;
let expectedDataSchemaString: string;
let expectedDataSchemaObject: extraction.params.DataSchema;

describe("MindeeV2 - Extraction Parameters", () => {
  const modelId = "test-model-id";

  describe("Polling Options", () => {
    it("should provide sensible defaults", () => {

      const paramsInstance = new extraction.ExtractionParameters({
        modelId: modelId,
      });
      assert.strictEqual(paramsInstance.modelId, modelId);
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

    it("should leave unset when not provided", () => {
      const params = new extraction.ExtractionParameters({
        modelId: modelId,
      });
      assert.strictEqual(params.dataSchema, undefined);
    });

    it("should initialize from a string", () => {
      const paramsString = new extraction.ExtractionParameters({
        modelId: modelId,
        dataSchema: expectedDataSchemaString,
      });
      assert.strictEqual(paramsString.dataSchema?.toString(), expectedDataSchemaString);
    });

    it("should initialize from a dictionary", () => {
      const paramsDict = new extraction.ExtractionParameters({
        modelId: modelId,
        dataSchema: expectedDataSchemaDict,
      });
      assert.strictEqual(JSON.stringify(paramsDict.dataSchema), expectedDataSchemaString);
    });

    it("should initialize from an object instance", () => {
      const paramsObject = new extraction.ExtractionParameters({
        modelId: modelId,
        dataSchema: expectedDataSchemaObject,
      });
      assert.strictEqual(paramsObject.dataSchema?.toString(), expectedDataSchemaString);
    });
  });
});
