import { expect } from "chai";
import path from "node:path";
import { InferenceResponse } from "../../../src/parsing/v2";
import { LocalResponse } from "../../../src";
import { FieldConfidence, ListField, ObjectField, SimpleField } from "../../../src/parsing/v2/field";
import { promises as fs } from "node:fs";
import { Polygon } from "../../../src/geometry";

const resourcesPath = path.join(__dirname, "..", "..", "data");
const v2DataDir = path.join(resourcesPath, "v2");
const findocPath = path.join(v2DataDir, "products", "financial_document");
const inferencePath = path.join(v2DataDir, "inference");
const deepNestedFieldPath = path.join(inferencePath, "deep_nested_fields.json");
const standardFieldPath = path.join(inferencePath, "standard_field_types.json");
const standardFieldRstPath = path.join(inferencePath, "standard_field_types.rst");
const locationFieldPath = path.join(findocPath, "complete_with_coordinates.json");
const rawTextPath = path.join(inferencePath, "raw_texts.json");
const blankPath = path.join(findocPath, "blank.json");
const completePath = path.join(findocPath, "complete.json");

async function loadV2Inference(resourcePath: string): Promise<InferenceResponse> {
  const localResponse = new LocalResponse(resourcePath);
  await localResponse.init();
  return localResponse.deserializeResponse(InferenceResponse);
}

describe("inference", async () => {
  describe("simple", async () => {
    it("should load a blank inference with valid properties", async () => {
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
        switch (entry.constructor.name) {
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

    it("should load a complete inference with valid properties", async () => {
      const response = await loadV2Inference(completePath);
      const inf = response.inference;

      expect(inf).to.not.be.undefined;
      expect(inf.id).to.eq("12345678-1234-1234-1234-123456789abc");

      const model = inf.model;
      expect(model).to.not.be.undefined;
      expect(model.id).to.eq("12345678-1234-1234-1234-123456789abc");

      const file = inf.file;
      expect(file).to.not.be.undefined;
      expect(file.name).to.eq("complete.jpg");
      expect(file.alias ?? null).to.be.null;
      expect(file.pageCount).to.eq(1);
      expect(file.mimeType).to.eq("image/jpeg");

      const fields = inf.result.fields;
      expect(fields).to.be.not.empty;
      expect(fields.size).to.be.eq(21);

      const dateField = fields.get("date") as SimpleField;
      expect(dateField).to.not.be.undefined;
      expect(dateField.value).to.eq("2019-11-02");

      expect(fields.has("taxes")).to.be.true;
      const taxes = fields.get("taxes");
      expect(taxes).to.be.instanceOf(ListField);

      const taxesList = taxes as ListField;
      expect(taxesList.items).to.have.lengthOf(1);
      expect(taxes?.toString()).to.be.a("string").and.not.be.empty;

      const firstTaxItem = taxesList.items[0];
      expect(firstTaxItem).to.be.instanceOf(ObjectField);

      const taxItemObj = firstTaxItem as ObjectField;
      expect(taxItemObj.fields.size).to.eq(3);

      const baseField = taxItemObj.fields.get("base") as SimpleField;
      expect(baseField.value).to.eq(31.5);

      expect(fields.has("supplier_address")).to.be.true;
      const supplierAddress = fields.get("supplier_address");
      expect(supplierAddress).to.be.instanceOf(ObjectField);

      const supplierObj = supplierAddress as ObjectField;
      const countryField = supplierObj.fields.get("country") as SimpleField;
      expect(countryField.value).to.eq("USA");
      expect(countryField.toString()).to.eq("USA");
      expect(supplierAddress?.toString()).to.be.a("string").and.not.be.empty;

      const customerAddr = fields.get("customer_address") as ObjectField;
      const cityField = customerAddr.fields.get("city") as SimpleField;
      expect(cityField.value).to.eq("New York");

      expect(inf.result.options).to.be.undefined;
    });
  });

  describe("nested", async () => {
    it("should load a deep nested object", async () => {
      const response = await loadV2Inference(deepNestedFieldPath);
      const fields = response.inference.result.fields;
      expect(fields.get("field_simple")).to.be.an.instanceof(SimpleField);
      expect(fields.get("field_object")).to.be.an.instanceof(ObjectField);

      const fieldObject = fields.get("field_object") as ObjectField;
      const lvl1 = fieldObject.fields;

      expect(lvl1.get("sub_object_list")).to.be.an.instanceof(ListField);
      expect(lvl1.get("sub_object_object")).to.be.an.instanceof(ObjectField);

      const subObjectObject = lvl1.get("sub_object_object") as ObjectField;
      const lvl2 = subObjectObject.fields;

      expect(
        lvl2.get("sub_object_object_sub_object_list")
      ).to.be.an.instanceof(ListField);

      const nestedList = lvl2.get(
        "sub_object_object_sub_object_list"
      ) as ListField;
      expect(nestedList.items).to.not.be.empty;
      expect(nestedList.items[0]).to.be.an.instanceof(ObjectField);

      const firstItemObj = nestedList.items[0] as ObjectField;
      const deepSimple = firstItemObj.fields.get(
        "sub_object_object_sub_object_list_simple"
      ) as SimpleField;

      expect(deepSimple).to.not.be.undefined;
      expect(deepSimple.value).to.eq("value_9");
    });
  });

  describe("standard field types", async () => {
    it("should recognize all field variants", async () => {
      const response = await loadV2Inference(standardFieldPath);
      const fields = response.inference.result.fields;

      expect(fields.get("field_simple_string")).to.be.instanceOf(SimpleField);
      const simpleFieldStr = fields.get("field_simple_string") as SimpleField;
      expect(simpleFieldStr.value).to.be.eq("field_simple_string-value");
      expect(fields.get("field_simple_float")).to.be.instanceOf(SimpleField);
      const simpleFieldFloat = fields.get("field_simple_float") as SimpleField;
      expect(simpleFieldFloat.value).to.be.eq(1.1);
      expect(fields.get("field_simple_int")).to.be.instanceOf(SimpleField);
      const simpleFieldInt = fields.get("field_simple_int") as SimpleField;
      expect(simpleFieldInt.value).to.be.eq(12.0);
      expect(fields.get("field_simple_zero")).to.be.instanceOf(SimpleField);
      const simpleFieldZero = fields.get("field_simple_zero") as SimpleField;
      expect(simpleFieldZero.value).to.be.eq(0);
      expect(fields.get("field_simple_bool")).to.be.instanceOf(SimpleField);
      const simpleFieldBool = fields.get("field_simple_bool") as SimpleField;
      expect(simpleFieldBool.value).to.be.eq(true);
      expect(fields.get("field_simple_null")).to.be.instanceOf(SimpleField);
      const simpleFieldNull = fields.get("field_simple_null") as SimpleField;
      expect(simpleFieldNull.value).to.be.eq(null);
      expect(fields.get("field_object")).to.be.instanceOf(ObjectField);
      expect(fields.get("field_simple_list")).to.be.instanceOf(ListField);
      expect(fields.get("field_object_list")).to.be.instanceOf(ListField);
    });
  });

  describe("options", async () => {
    it("raw texts should be exposed", async () => {
      const response = await loadV2Inference(rawTextPath);
      const opts = response.inference.result.options;

      expect(opts).to.not.be.undefined;
      const rawTexts =
        (opts as any).rawTexts ?? (opts as any).getRawTexts?.() ?? [];

      expect(rawTexts).to.be.an("array").and.have.lengthOf(2);

      const first = rawTexts[0];
      expect(first.page).to.eq(0);
      expect(first.content).to.eq(
        "This is the raw text of the first page..."
      );
    });
  });

  describe("rst display", async () => {
    it("to be properly exposed", async () => {
      const response = await loadV2Inference(standardFieldPath);
      const rstString = await fs.readFile(standardFieldRstPath, "utf8");

      expect(response.inference).to.not.be.null;
      expect(response.inference.toString()).to.be.eq(rstString);
    }).timeout(10000);
  });

  describe("field locations and confidence", async () => {
    it("to be properly exposed", async () => {
      const response = await loadV2Inference(locationFieldPath);

      expect(response.inference).to.not.be.null;

      const dateField = response.inference.result.fields.get("date") as SimpleField;
      expect(dateField.locations).to.exist;
      expect(dateField.locations![0]).to.exist;
      expect(dateField.locations![0].page).to.equal(0);

      const polygon: Polygon = dateField.locations![0].polygon!;

      expect(polygon[0].length).to.equal(2);

      expect(polygon[0][0]).to.equal(0.948979073166918);
      expect(polygon[0][1]).to.equal(0.23097924535067715);

      expect(polygon[1][0]).to.equal(0.85422);
      expect(polygon[1][1]).to.equal(0.230072);

      expect(polygon[2][0]).to.equal(0.8540899268330819);
      expect(polygon[2][1]).to.equal(0.24365775464932288);

      expect(polygon[3][0]).to.equal(0.948849);
      expect(polygon[3][1]).to.equal(0.244565);

      expect(dateField.confidence).to.equal(FieldConfidence.medium);
      expect(String(dateField.confidence)).to.equal("Medium");

    }).timeout(10000);
  });
});
