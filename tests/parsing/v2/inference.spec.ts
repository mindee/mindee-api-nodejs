import { expect } from "chai";
import path from "node:path";
import { LocalResponse, InferenceResponse, RawText } from "../../../src";
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
      const inference = response.inference;

      expect(inference).to.not.be.undefined;
      expect(inference.id).to.eq("12345678-1234-1234-1234-123456789abc");

      const model = inference.model;
      expect(model).to.not.be.undefined;
      expect(model.id).to.eq("12345678-1234-1234-1234-123456789abc");

      const file = inference.file;
      expect(file).to.not.be.undefined;
      expect(file.name).to.eq("complete.jpg");
      expect(file.alias ?? null).to.be.null;
      expect(file.pageCount).to.eq(1);
      expect(file.mimeType).to.eq("image/jpeg");

      const fields = inference.result.fields;
      expect(fields).to.be.not.empty;
      expect(fields.size).to.be.eq(21);

      const dateField = fields.getSimpleField("date");
      expect(dateField).to.not.be.undefined;
      expect(dateField.value).to.eq("2019-11-02");

      expect(fields.has("taxes")).to.be.true;
      const taxes = fields.get("taxes");
      expect(taxes).to.be.instanceOf(ListField);

      const taxesList = fields.getListField("taxes");
      expect(taxesList.items).to.have.lengthOf(1);
      expect(taxesList.objectItems).to.have.lengthOf(1);
      expect(taxes?.toString()).to.be.a("string").and.not.be.empty;

      const firstTaxItem = taxesList.items[0];
      expect(firstTaxItem).to.be.instanceOf(ObjectField);

      const taxItemObj = firstTaxItem as ObjectField;
      expect(taxItemObj.fields.size).to.eq(3);

      const baseField = taxItemObj.fields.getSimpleField("base");
      expect(baseField.value).to.eq(31.5);

      expect(fields.has("supplier_address")).to.be.true;
      const supplierAddress = fields.get("supplier_address");
      expect(supplierAddress).to.be.instanceOf(ObjectField);

      const supplierObj = fields.getObjectField("supplier_address");
      const countryField = supplierObj.fields.getSimpleField("country");
      expect(countryField.value).to.eq("USA");
      expect(countryField.toString()).to.eq("USA");
      expect(supplierAddress?.toString()).to.be.a("string").and.not.be.empty;

      const customerAddr = fields.getObjectField("customer_address");
      const cityField = customerAddr.fields.getSimpleField("city");
      expect(cityField.value).to.eq("New York");

      expect(inference.result.rawText).to.be.undefined;
    });
  });

  describe("nested", async () => {
    it("should load a deep nested object", async () => {
      const response = await loadV2Inference(deepNestedFieldPath);
      const fields = response.inference.result.fields;
      expect(fields.get("field_simple")).to.be.an.instanceof(SimpleField);
      expect(fields.get("field_object")).to.be.an.instanceof(ObjectField);

      const fieldObject = fields.getObjectField("field_object");
      const lvl1 = fieldObject.fields;

      expect(lvl1.get("sub_object_list")).to.be.an.instanceof(ListField);
      expect(lvl1.get("sub_object_object")).to.be.an.instanceof(ObjectField);

      const subObjectObject = lvl1.getObjectField("sub_object_object");
      const lvl2 = subObjectObject.fields;

      expect(
        lvl2.get("sub_object_object_sub_object_list")
      ).to.be.an.instanceof(ListField);

      const nestedList = lvl2.getListField(
        "sub_object_object_sub_object_list"
      );
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
    it("should recognize simple fields", async () => {
      const response = await loadV2Inference(standardFieldPath);
      const fields = response.inference.result.fields;

      expect(fields.get("field_simple_string")).to.be.instanceOf(SimpleField);
      const simpleFieldStr = fields.getSimpleField("field_simple_string");
      expect(simpleFieldStr.value).to.be.eq("field_simple_string-value");
      expect(simpleFieldStr.stringValue).to.be.eq("field_simple_string-value");
      expect(() => simpleFieldStr.numberValue).to.throw("Value is not a number");
      expect(() => simpleFieldStr.booleanValue).to.throw("Value is not a boolean");

      expect(fields.get("field_simple_float")).to.be.instanceOf(SimpleField);
      const simpleFieldFloat = fields.getSimpleField("field_simple_float");
      expect(simpleFieldFloat.value).to.be.eq(1.1);
      expect(simpleFieldFloat.numberValue).to.be.eq(1.1);
      expect(() => simpleFieldFloat.stringValue).to.throw("Value is not a string");
      expect(() => simpleFieldFloat.booleanValue).to.throw("Value is not a boolean");

      expect(fields.get("field_simple_int")).to.be.instanceOf(SimpleField);
      const simpleFieldInt = fields.getSimpleField("field_simple_int");
      expect(simpleFieldInt.value).to.be.eq(12.0);

      expect(fields.get("field_simple_zero")).to.be.instanceOf(SimpleField);
      const simpleFieldZero = fields.getSimpleField("field_simple_zero");
      expect(simpleFieldZero.value).to.be.eq(0);
      expect(simpleFieldZero.numberValue).to.be.eq(0);

      expect(fields.get("field_simple_bool")).to.be.instanceOf(SimpleField);
      const simpleFieldBool = fields.getSimpleField("field_simple_bool");
      expect(simpleFieldBool.value).to.be.eq(true);
      expect(simpleFieldBool.booleanValue).to.be.eq(true);
      expect(() => simpleFieldBool.stringValue).to.throw("Value is not a string");
      expect(() => simpleFieldBool.numberValue).to.throw("Value is not a number");

      expect(fields.get("field_simple_null")).to.be.instanceOf(SimpleField);
      const simpleFieldNull = fields.getSimpleField("field_simple_null");
      expect(simpleFieldNull.value).to.be.eq(null);
      expect(simpleFieldNull.stringValue).to.be.eq(null);
      expect(simpleFieldNull.numberValue).to.be.eq(null);
      expect(simpleFieldNull.booleanValue).to.be.eq(null);
    });

    it("should recognize simple list fields", async () => {
      const response = await loadV2Inference(standardFieldPath);
      const fields = response.inference.result.fields;

      expect(fields.get("field_simple_list")).to.be.instanceOf(ListField);
      const fieldSimpleList = fields.getListField("field_simple_list");
      expect(fieldSimpleList.items.length).to.be.eq(2);
      const subFields = fieldSimpleList.simpleItems;
      expect(subFields.length).to.be.eq(2);

      for (const subField of subFields) {
        expect(subField.value).to.be.not.null;
      }
    });

    it("should recognize object fields", async () => {
      const response = await loadV2Inference(standardFieldPath);
      const fields = response.inference.result.fields;

      expect(fields.get("field_object")).to.be.instanceOf(ObjectField);
      const objectField = fields.getObjectField("field_object");
      expect(objectField.fields.size).to.be.eq(2);
      const subFields = objectField.simpleFields;
      expect(subFields.size).to.be.eq(2);

      const subField1 = subFields.get("subfield_1");
      expect(subField1?.value).to.be.not.null;

      subFields.forEach((subField, fieldName) => {
        expect(fieldName.startsWith("subfield_")).to.be.true;
        expect(subField.value).to.be.not.null;
      });
    });

    it("should recognize object list fields", async () => {
      const response = await loadV2Inference(standardFieldPath);
      const fields = response.inference.result.fields;

      expect(fields.get("field_object_list")).to.be.instanceOf(ListField);
      const fieldObjectList = fields.getListField("field_object_list");
      expect(fieldObjectList.items.length).to.be.eq(2);
      const objectItems = fieldObjectList.objectItems;
      expect(objectItems.length).to.be.eq(2);

      for (const itemField of objectItems) {
        const subFields = itemField.simpleFields;
        expect(subFields).to.be.not.null;

        const subField1 = subFields.get("subfield_1");
        expect(subField1?.value).to.be.not.null;

        subFields.forEach((subField, fieldName) => {
          expect(fieldName.startsWith("subfield_")).to.be.true;
          expect(subField.value).to.be.not.null;
        });
      }
    });
  });

  describe("raw text", async () => {
    it("raw text should be exposed", async () => {
      const response = await loadV2Inference(rawTextPath);
      const rawText = response.inference.result.rawText;

      expect(rawText).to.be.instanceOf(RawText);

      const pages = rawText?.pages;
      if (pages === undefined) throw new Error("pages is undefined");

      expect(pages).to.be.an("array").and.have.lengthOf(2);
      const first = pages[0];
      expect(first.content).to.eq("This is the raw text of the first page...");
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

      const isCertainEnum = dateField.confidence === FieldConfidence.Medium;
      expect(isCertainEnum).to.be.true;

      const isCertainStr = dateField.confidence === "Medium";
      expect(isCertainStr).to.be.true;

    }).timeout(10000);
  });
});
