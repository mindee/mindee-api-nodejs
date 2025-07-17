import { expect } from "chai";
import path from "node:path";
import { InferenceResponse } from "../../../src/parsing/v2";
import { ClientV2, LocalResponse } from "../../../src";
import { ListField, ObjectField, SimpleField } from "../../../src/parsing/v2/field";

const resourcesPath = path.join(__dirname, "..", "..", "data");
const v2DataDir = path.join(resourcesPath, "v2");
const blankPath = path.join(v2DataDir, "products", "financial_document", "blank.json");
async function loadV2Inference(resourcePath: string): Promise<InferenceResponse> {
  const dummyClient = new ClientV2({ apiKey: "dummy-key" });
  const localResponse = new LocalResponse(resourcePath);
  await localResponse.init();
  return dummyClient.loadInference(localResponse);
}

describe("inference", async () => {
  it("should load a blank prediction with valid property", async () => {
    const response = await loadV2Inference(blankPath);
    const fields = response.inference.result.fields;

    expect(fields).to.be.not.empty;
    expect(fields.size).to.be.eq(21);
    expect(fields.has("taxes")).to.be.true;
    expect(fields.get("taxes")).to.not.be.null;
    expect(fields.get("taxes")).to.be.an.instanceof(ListField);

    expect(fields.get("supplier_address")).to.not.be.null;
    expect(fields.get("supplier_address")).to.be.an.instanceof(ObjectField);
    for (const entry of fields.values()) {
      if (entry instanceof SimpleField && entry.value === null) {
        continue;
      }
      switch(entry.constructor.name) {
      case "SimpleField":
        expect((entry as SimpleField).value).to.not.be.null;
        break;
      case "ObjectField":
        expect((entry as ObjectField).fields).to.not.be.null;
        break;
      case "ListField":
        expect((entry as ListField).items).to.not.be.null;
        break;
      }
    }
  });
});
