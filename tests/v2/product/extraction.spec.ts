import path from "path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { promises as fs } from "node:fs";
import { Polygon } from "@/geometry/index.js";
import {
  FieldConfidence,
  ListField,
  ObjectField,
  SimpleField,
} from "@/v2/parsing/inference/field/index.js";
import { field } from "@/v2/parsing/index.js";
import { ExtractionResponse } from "@/v2/product/index.js";

import { V2_PRODUCT_PATH } from "../../index.js";
import { loadV2Response } from "./utils.js";

const findocPath = path.join(V2_PRODUCT_PATH, "extraction", "financial_document");
const extractionPath = path.join(V2_PRODUCT_PATH, "extraction");
const deepNestedFieldPath = path.join(extractionPath, "deep_nested_fields.json");
const standardFieldPath = path.join(extractionPath, "standard_field_types.json");
const standardFieldRstPath = path.join(extractionPath, "standard_field_types.rst");
const locationFieldPath = path.join(findocPath, "complete_with_coordinates.json");

describe("MindeeV2 - Extraction Response", async () => {
  describe("Financial Document", async () => {
    it("should load a blank inference with valid properties", async () => {
      const response = await loadV2Response(
        ExtractionResponse,
        path.join(findocPath, "blank.json")
      );
      const fields = response.inference.result.fields;

      assert.ok(fields);
      assert.strictEqual(fields.size, 21);
      assert.ok(fields.has("taxes"));
      assert.notStrictEqual(fields.get("taxes"), null);
      assert.ok(fields.get("taxes") instanceof ListField);

      assert.notStrictEqual(fields.get("supplier_address"), null);
      assert.ok(fields.get("supplier_address") instanceof ObjectField);
      for (const entry of fields.values()) {
        if (entry instanceof SimpleField && entry.value === null) {
          continue;
        }
        switch (entry.constructor.name) {
        case "SimpleField":
          assert.notStrictEqual((entry as SimpleField).value, null);
          break;
        case "ObjectField":
          assert.notStrictEqual((entry as ObjectField).fields, null);
          break;
        case "ListField":
          assert.notStrictEqual((entry as ListField).items, null);
          break;
        }
      }
    });

    it("should load a complete inference with valid properties", async () => {
      const response = await loadV2Response(
        ExtractionResponse,
        path.join(findocPath, "complete.json")
      );
      const inference = response.inference;

      assert.notStrictEqual(inference, undefined);
      assert.strictEqual(inference.model.id, "12345678-1234-1234-1234-123456789abc");

      const model = inference.model;
      assert.notStrictEqual(model, undefined);
      assert.strictEqual(model.id, "12345678-1234-1234-1234-123456789abc");

      const file = inference.file;
      assert.notStrictEqual(file, undefined);
      assert.strictEqual(file.name, "complete.jpg");
      assert.strictEqual(file.alias ?? null, null);
      assert.strictEqual(file.pageCount, 1);
      assert.strictEqual(file.mimeType, "image/jpeg");

      const fields = inference.result.fields;
      assert.ok(fields);
      assert.strictEqual(fields.size, 21);

      const dateField = fields.getSimpleField("date");
      assert.notStrictEqual(dateField, undefined);
      assert.strictEqual(dateField.value, "2019-11-02");

      assert.ok(fields.has("taxes"));
      const taxes = fields.get("taxes");
      assert.ok(taxes instanceof ListField);

      const taxesList = fields.getListField("taxes");
      assert.strictEqual(taxesList.items.length, 1);
      assert.strictEqual(taxesList.objectItems.length, 1);
      assert.ok(typeof taxes?.toString() === "string" && taxes.toString().length > 0);

      const firstTaxItem = taxesList.items[0];
      assert.ok(firstTaxItem instanceof ObjectField);

      const taxItemObj = firstTaxItem as ObjectField;
      assert.strictEqual(taxItemObj.fields.size, 3);

      const baseField = taxItemObj.fields.getSimpleField("base");
      assert.strictEqual(baseField.value, 31.5);

      assert.ok(fields.has("supplier_address"));
      const supplierAddress = fields.get("supplier_address");
      assert.ok(supplierAddress instanceof ObjectField);

      const supplierObj = fields.getObjectField("supplier_address");
      const countryField = supplierObj.fields.getSimpleField("country");
      assert.strictEqual(countryField.value, "USA");
      assert.strictEqual(countryField.toString(), "USA");
      assert.ok(typeof supplierAddress?.toString() === "string" && supplierAddress.toString().length > 0);

      const customerAddr = fields.getObjectField("customer_address");
      const cityField = customerAddr.fields.getSimpleField("city");
      assert.strictEqual(cityField.value, "New York");

      assert.strictEqual(inference.result.rawText, undefined);
    });
  });

  describe("Deeply Nested", async () => {
    it("should load a deep nested object", async () => {
      const response = await loadV2Response(
        ExtractionResponse, deepNestedFieldPath
      );
      const fields = response.inference.result.fields;
      assert.ok(fields.get("field_simple") instanceof SimpleField);
      assert.ok(fields.get("field_object") instanceof ObjectField);

      const fieldObject = fields.getObjectField("field_object");
      assert.ok(fieldObject.getSimpleField("sub_object_simple") instanceof SimpleField);
      assert.ok(fieldObject.getListField("sub_object_list") instanceof ListField);
      assert.ok(fieldObject.getObjectField("sub_object_object") instanceof ObjectField);
      assert.strictEqual(fieldObject.simpleFields.size, 1);
      assert.strictEqual(fieldObject.listFields.size, 1);
      assert.strictEqual(fieldObject.objectFields.size, 1);
      const lvl1 = fieldObject.fields;

      assert.ok(lvl1.get("sub_object_list") instanceof ListField);
      assert.ok(lvl1.get("sub_object_object") instanceof ObjectField);

      const subObjectObject = lvl1.getObjectField("sub_object_object");
      const lvl2 = subObjectObject.fields;

      assert.ok(lvl2.get("sub_object_object_sub_object_list") instanceof ListField);

      const nestedList = lvl2.getListField(
        "sub_object_object_sub_object_list"
      );
      assert.ok(nestedList.items.length > 0);
      assert.ok(nestedList.items[0] instanceof ObjectField);

      const firstItemObj = nestedList.items[0] as ObjectField;
      const deepSimple = firstItemObj.fields.get(
        "sub_object_object_sub_object_list_simple"
      ) as SimpleField;

      assert.notStrictEqual(deepSimple, undefined);
      assert.strictEqual(deepSimple.value, "value_9");
    });
  });

  describe("Standard Field Types", async () => {
    it("should recognize simple fields", async () => {
      const response = await loadV2Response(
        ExtractionResponse, standardFieldPath
      );
      const fields = response.inference.result.fields;

      assert.ok(fields.get("field_simple_string") instanceof SimpleField);
      const simpleFieldStr = fields.getSimpleField("field_simple_string");
      assert.strictEqual(simpleFieldStr.value, "field_simple_string-value");
      assert.strictEqual(simpleFieldStr.stringValue, "field_simple_string-value");
      assert.strictEqual(simpleFieldStr.confidence, FieldConfidence.Certain);
      assert.throws(() => simpleFieldStr.numberValue, /Value is not a number/);
      assert.throws(() => simpleFieldStr.booleanValue, /Value is not a boolean/);

      assert.ok(fields.get("field_simple_float") instanceof SimpleField);
      const simpleFieldFloat = fields.getSimpleField("field_simple_float");
      assert.strictEqual(simpleFieldFloat.value, 1.1);
      assert.strictEqual(simpleFieldFloat.numberValue, 1.1);
      assert.strictEqual(simpleFieldFloat.confidence, FieldConfidence.High);
      assert.throws(() => simpleFieldFloat.stringValue, /Value is not a string/);
      assert.throws(() => simpleFieldFloat.booleanValue, /Value is not a boolean/);

      assert.ok(fields.get("field_simple_int") instanceof SimpleField);
      const simpleFieldInt = fields.getSimpleField("field_simple_int");
      assert.strictEqual(simpleFieldInt.confidence, FieldConfidence.Medium);
      assert.strictEqual(simpleFieldInt.value, 12.0);

      assert.ok(fields.get("field_simple_zero") instanceof SimpleField);
      const simpleFieldZero = fields.getSimpleField("field_simple_zero");
      assert.strictEqual(simpleFieldZero.confidence, FieldConfidence.Low);
      assert.strictEqual(simpleFieldZero.value, 0);
      assert.strictEqual(simpleFieldZero.numberValue, 0);

      assert.ok(fields.get("field_simple_bool") instanceof SimpleField);
      const simpleFieldBool = fields.getSimpleField("field_simple_bool");
      assert.strictEqual(simpleFieldBool.value, true);
      assert.strictEqual(simpleFieldBool.booleanValue, true);
      assert.throws(() => simpleFieldBool.stringValue, /Value is not a string/);
      assert.throws(() => simpleFieldBool.numberValue, /Value is not a number/);

      assert.ok(fields.get("field_simple_null") instanceof SimpleField);
      const simpleFieldNull = fields.getSimpleField("field_simple_null");
      assert.strictEqual(simpleFieldNull.value, null);
      assert.strictEqual(simpleFieldNull.stringValue, null);
      assert.strictEqual(simpleFieldNull.numberValue, null);
      assert.strictEqual(simpleFieldNull.booleanValue, null);
    });

    it("should recognize simple list fields", async () => {
      const response = await loadV2Response(
        ExtractionResponse, standardFieldPath
      );
      const fields = response.inference.result.fields;

      assert.ok(fields.get("field_simple_list") instanceof ListField);
      const fieldSimpleList = fields.getListField("field_simple_list");
      assert.strictEqual(fieldSimpleList.items.length, 2);
      const subFields = fieldSimpleList.simpleItems;
      assert.strictEqual(subFields.length, 2);

      for (const subField of subFields) {
        assert.notStrictEqual(subField.value, null);
      }
    });

    it("should recognize object fields", async () => {
      const response = await loadV2Response(
        ExtractionResponse, standardFieldPath
      );
      const fields = response.inference.result.fields;

      assert.ok(fields.get("field_object") instanceof ObjectField);
      const objectField = fields.getObjectField("field_object");
      assert.strictEqual(objectField.fields.size, 2);
      const subFields = objectField.simpleFields;
      assert.strictEqual(subFields.size, 2);

      const subField1 = subFields.get("subfield_1");
      assert.notStrictEqual(subField1?.value, null);
      assert.strictEqual(subField1?.confidence, FieldConfidence.High);

      subFields.forEach((subField, fieldName) => {
        assert.ok(fieldName.startsWith("subfield_"));
        assert.notStrictEqual(subField.value, null);
      });
    });

    it("should recognize object list fields", async () => {
      const response = await loadV2Response(
        ExtractionResponse, standardFieldPath
      );
      const fields = response.inference.result.fields;

      assert.ok(fields.get("field_object_list") instanceof ListField);
      const fieldObjectList = fields.getListField("field_object_list");
      assert.strictEqual(fieldObjectList.items.length, 2);
      const objectItems = fieldObjectList.objectItems;
      assert.strictEqual(objectItems.length, 2);

      for (const itemField of objectItems) {
        const subFields = itemField.simpleFields;
        assert.notStrictEqual(subFields, null);

        const subField1 = subFields.get("subfield_1");
        assert.notStrictEqual(subField1?.value, null);

        subFields.forEach((subField, fieldName) => {
          assert.ok(fieldName.startsWith("subfield_"));
          assert.notStrictEqual(subField.value, null);
        });
      }
    });
  });

  describe("Raw Text", async () => {
    it("raw text should be exposed", async () => {
      const response = await loadV2Response(
        ExtractionResponse, path.join(extractionPath, "raw_texts.json")
      );
      assert.strictEqual(response.inference.result.rag, undefined);

      const rawText = response.inference.result.rawText;
      assert.ok(rawText instanceof field.RawText);

      const pages = rawText?.pages;
      if (pages === undefined) throw new Error("pages is undefined");

      assert.ok(Array.isArray(pages) && pages.length === 2);
      const first = pages[0];
      assert.strictEqual(first.content, "This is the raw text of the first page...");
    });
  });

  describe("RAG Metadata", async () => {
    it("RAG metadata when matched", async () => {
      const response = await loadV2Response(
        ExtractionResponse, path.join(extractionPath, "rag_matched.json")
      );
      const rag = response.inference.result.rag;
      assert.ok(rag instanceof field.RagMetadata);
      assert.strictEqual(rag?.retrievedDocumentId, "12345abc-1234-1234-1234-123456789abc");
    });

    it("RAG metadata when not matched", async () => {
      const response = await loadV2Response(
        ExtractionResponse, path.join(extractionPath, "rag_not_matched.json")
      );
      const rag = response.inference.result.rag;
      assert.ok(rag instanceof field.RagMetadata);
      assert.strictEqual(rag?.retrievedDocumentId, undefined);
    });
  });

  describe("RST Display", async () => {
    it("to be properly exposed", async () => {
      const response = await loadV2Response(
        ExtractionResponse, standardFieldPath
      );
      const rstString = await fs.readFile(standardFieldRstPath, "utf8");

      assert.notStrictEqual(response.inference, null);
      assert.strictEqual(response.inference.toString(), rstString);
    });
  });

  describe("Field Locations and Confidence", async () => {
    it("to be properly exposed", async () => {
      const response = await loadV2Response(
        ExtractionResponse, locationFieldPath
      );
      assert.notStrictEqual(response.inference, null);

      const dateField = response.inference.result.fields.get("date") as SimpleField;
      assert.ok(dateField.locations);
      assert.ok(dateField.locations![0]);
      assert.strictEqual(dateField.locations![0].page, 0);

      const polygon: Polygon = dateField.locations![0].polygon!;

      assert.strictEqual(polygon[0].length, 2);

      assert.strictEqual(polygon[0][0], 0.948979073166918);
      assert.strictEqual(polygon[0][1], 0.23097924535067715);

      assert.strictEqual(polygon[1][0], 0.85422);
      assert.strictEqual(polygon[1][1], 0.230072);

      assert.strictEqual(polygon[2][0], 0.8540899268330819);
      assert.strictEqual(polygon[2][1], 0.24365775464932288);

      assert.strictEqual(polygon[3][0], 0.948849);
      assert.strictEqual(polygon[3][1], 0.244565);

      const eqConfidenceEnum = dateField.confidence === FieldConfidence.Medium;
      assert.ok(eqConfidenceEnum);

      assert.ok(dateField.confidence === "Medium");
      assert.ok(FieldConfidence.toInt(dateField.confidence) === 2);

      assert.ok(FieldConfidence.greaterThan(dateField.confidence, FieldConfidence.Low));
      assert.ok(FieldConfidence.greaterThanOrEqual(dateField.confidence, FieldConfidence.Low));
      assert.ok(FieldConfidence.greaterThanOrEqual(dateField.confidence, FieldConfidence.Medium));
      assert.ok(FieldConfidence.lessThanOrEqual(dateField.confidence, FieldConfidence.Medium));
      assert.ok(FieldConfidence.lessThanOrEqual(dateField.confidence, FieldConfidence.Certain));
      assert.ok(FieldConfidence.lessThan(dateField.confidence, FieldConfidence.Certain));

    });
  });
});
