import { StringDict } from "@/parsing/index.js";
import path from "path";
import { V2_RESOURCE_PATH } from "../../index.js";
import { InferenceParameters } from "@/index.js";
import { expect } from "chai";
import { DataSchema } from "@/index.js";
import { promises as fs } from "fs";

let expectedDataSchemaDict: StringDict;
let expectedDataSchemaString: string;
let expectedDataSchemaObject: DataSchema;

describe("MindeeV2 - Inference Parameter", () => {
  before(async () => {
    const fileContents = await fs.readFile(path.join(V2_RESOURCE_PATH, "inference/data_schema_replace_param.json"));
    expectedDataSchemaDict = JSON.parse(fileContents.toString());
    expectedDataSchemaString = JSON.stringify(expectedDataSchemaDict);
    expectedDataSchemaObject = new DataSchema(expectedDataSchemaDict);
  });

  describe("dataSchema", () => {
    it("shouldn't replace when unset", async () => {
      const params: InferenceParameters = {
        modelId: "test-model-id",
      };

      expect(params.dataSchema).to.be.undefined;
    });

    it("should equate no matter the type", async () => {
      const paramsDict: InferenceParameters = {
        modelId: "test-model-id",
        dataSchema: expectedDataSchemaDict,
      };
      const paramsString: InferenceParameters = {
        modelId: "test-model-id",
        dataSchema: expectedDataSchemaString,
      };
      const paramsObject: InferenceParameters = {
        modelId: "test-model-id",
        dataSchema: expectedDataSchemaObject,
      };

      expect(JSON.stringify(paramsDict.dataSchema)).to.eq(expectedDataSchemaString);
      expect(paramsObject.dataSchema?.toString()).to.eq(expectedDataSchemaString);
      expect(paramsString.dataSchema?.toString()).to.eq(expectedDataSchemaString);
    });
  });
});
