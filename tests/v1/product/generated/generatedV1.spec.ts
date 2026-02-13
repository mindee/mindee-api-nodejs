import { promises as fs } from "fs";
import * as path from "path";
import assert from "node:assert/strict";
import * as mindee from "@/index.js";
import { Page } from "@/v1/index.js";
import { GeneratedV1 } from "@/v1/product/index.js";
import { GeneratedListField, GeneratedObjectField } from "@/v1/parsing/generated/index.js";
import { GeneratedV1Page } from "@/v1/product/generated/generatedV1Page.js";
import { StringField } from "@/v1/parsing/standard/index.js";
import { V1_PRODUCT_PATH } from "../../../index.js";

const dataPathInternationalId = {
  complete: path.join(V1_PRODUCT_PATH, "generated/response_v1/complete_international_id_v1.json"),
  empty: path.join(V1_PRODUCT_PATH, "generated/response_v1/empty_international_id_v1.json"),
  docString: path.join(V1_PRODUCT_PATH, "generated/response_v1/summary_full_international_id_v1.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "generated/response_v1/summary_page0_international_id_v1.rst"),
  emptyDocString: path.join(V1_PRODUCT_PATH, "generated/response_v1/summary_empty_international_id_v1.rst"),
};

const dataPathInvoice = {
  complete: path.join(V1_PRODUCT_PATH, "generated/response_v1/complete_invoice_v4.json"),
  empty: path.join(V1_PRODUCT_PATH, "generated/response_v1/empty_invoice_v4.json"),
  docString: path.join(V1_PRODUCT_PATH, "generated/response_v1/summary_full_invoice_v4.rst"),
  page0String: path.join(V1_PRODUCT_PATH, "generated/response_v1/summary_page0_invoice_v4.rst"),
  emptyDocString: path.join(V1_PRODUCT_PATH, "generated/response_v1/summary_empty_invoice_v4.rst"),
};


describe("Generated Document Object initialization on an OTS invoice", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(dataPathInvoice.empty);
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.v1.Document(GeneratedV1, response.document);
    assert.strictEqual(doc.inference.prediction.fields.get("customer_address").value, undefined);
    assert.strictEqual(doc.inference.prediction.fields.get("customer_company_registrations").values.length, 0);
    assert.strictEqual(doc.inference.prediction.fields.get("customer_name").value, undefined);
    assert.strictEqual(doc.inference.prediction.fields.get("date").value, undefined);
    assert.strictEqual(doc.inference.prediction.fields.get("document_type").value, "INVOICE");
    assert.strictEqual(doc.inference.prediction.fields.get("due_date").value, undefined);
    assert.strictEqual(doc.inference.prediction.fields.get("invoice_number").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("line_items") instanceof GeneratedListField);
    assert.strictEqual(doc.inference.prediction.fields.get("line_items").values.length, 0);
    assert.ok(doc.inference.prediction.fields.get("locale") instanceof GeneratedObjectField);
    assert.ok(doc.inference.prediction.fields.get("locale").currency === null);
    assert.ok(doc.inference.prediction.fields.get("locale").language === null);
    assert.strictEqual(doc.inference.prediction.fields.get("reference_numbers").values.length, 0);
    assert.strictEqual(doc.inference.prediction.fields.get("supplier_address").value, undefined);
    assert.strictEqual(doc.inference.prediction.fields.get("supplier_company_registrations").values.length, 0);
    assert.strictEqual(doc.inference.prediction.fields.get("supplier_name").value, undefined);
    assert.strictEqual(doc.inference.prediction.fields.get("supplier_payment_details").values.length, 0);
    assert.strictEqual(doc.inference.prediction.fields.get("taxes").values.length, 0);
    assert.strictEqual(doc.inference.prediction.fields.get("total_amount").value, undefined);
    assert.strictEqual(doc.inference.prediction.fields.get("total_net").value, undefined);
    const docString = await fs.readFile(path.join(dataPathInvoice.emptyDocString));
    assert.strictEqual(doc.toString(), docString.toString());
  });

  it("should load a single page prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInvoice.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const page = new Page(GeneratedV1Page, response.document.inference.pages[0], 0);
    assert.strictEqual(page.prediction.fields.get("customer_address").value, undefined);
    assert.strictEqual(page.prediction.fields.get("customer_company_registrations").values.length, 0);
    assert.strictEqual(page.prediction.fields.get("customer_name").value, undefined);
    assert.strictEqual(page.prediction.fields.get("date").value, "2020-02-17");
    assert.strictEqual(page.prediction.fields.get("document_type").value, "INVOICE");
    assert.strictEqual(page.prediction.fields.get("due_date").value, "2020-02-17");
    assert.strictEqual(page.prediction.fields.get("invoice_number").value, "0042004801351");
    assert.ok(page.prediction.fields.get("line_items") instanceof GeneratedListField);
    assert.ok(page.prediction.fields.get("line_items").values[0] instanceof GeneratedObjectField);
    assert.strictEqual(page.prediction.fields.get("line_items").values[0].description, "S)BOIE 5X500 FEUILLES A4");
    assert.ok(page.prediction.fields.get("line_items").values[0].product_code === null);
    assert.ok(page.prediction.fields.get("line_items").values[0].quantity === null);
    assert.ok(page.prediction.fields.get("line_items").values[0].tax_amount === null);
    assert.ok(page.prediction.fields.get("line_items").values[0].tax_rate === null);
    assert.strictEqual(page.prediction.fields.get("line_items").values[0].total_amount, "2.63");
    assert.ok(page.prediction.fields.get("line_items").values[0].unit_price === null);
    assert.ok(page.prediction.fields.get("locale") instanceof GeneratedObjectField);
    assert.strictEqual(page.prediction.fields.get("locale").currency, "EUR");
    assert.strictEqual(page.prediction.fields.get("locale").language, "fr");
    assert.strictEqual(page.prediction.fields.get("reference_numbers").values.length, 0);
    assert.strictEqual(page.prediction.fields.get("supplier_address").value, undefined);
    assert.strictEqual(page.prediction.fields.get("supplier_company_registrations").values.length, 0);
    assert.strictEqual(page.prediction.fields.get("supplier_name").value, undefined);
    assert.strictEqual(page.prediction.fields.get("supplier_payment_details").values[0].iban,
      "FR7640254025476501124705368"
    );
    assert.deepStrictEqual(page.prediction.fields.get("taxes").values[0].polygon.polygon,
      [[0.292, 0.749], [0.543, 0.749], [0.543, 0.763], [0.292, 0.763]]
    );
    assert.strictEqual(page.prediction.fields.get("taxes").values[0].rate, "20.0");
    assert.strictEqual(page.prediction.fields.get("taxes").values[0].value, "97.98");
    assert.strictEqual(page.prediction.fields.get("total_amount").value, "587.95");
    assert.strictEqual(page.prediction.fields.get("total_net").value, "489.97");
    const page0String = await fs.readFile(path.join(dataPathInvoice.page0String));
    assert.strictEqual(page.toString(), page0String.toString());
  });

  it("should load a complete document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInvoice.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.v1.Document(GeneratedV1, response.document);
    assert.strictEqual(doc.inference.prediction.fields.get("customer_address").value,
      "1954 Bloon Street West Toronto, ON, M6P 3K9 Canada"
    );
    assert.strictEqual(doc.inference.prediction.fields.get("customer_company_registrations").values.length, 0);
    assert.strictEqual(doc.inference.prediction.fields.get("customer_name").value, "JIRO DOI");
    assert.strictEqual(doc.inference.prediction.fields.get("date").value, "2020-02-17");
    assert.strictEqual(doc.inference.prediction.fields.get("document_type").value, "INVOICE");
    assert.strictEqual(doc.inference.prediction.fields.get("due_date").value, "2020-02-17");
    assert.strictEqual(doc.inference.prediction.fields.get("invoice_number").value, "0042004801351");
    assert.ok(doc.inference.prediction.fields.get("line_items") instanceof GeneratedListField);
    assert.ok(doc.inference.prediction.fields.get("line_items").values[0] instanceof GeneratedObjectField);
    assert.strictEqual(doc.inference.prediction.fields.get("line_items").values[0].description,
      "S)BOIE 5X500 FEUILLES A4"
    );
    assert.ok(doc.inference.prediction.fields.get("line_items").values[0].product_code === null);
    assert.ok(doc.inference.prediction.fields.get("line_items").values[0].quantity === null);
    assert.ok(doc.inference.prediction.fields.get("line_items").values[0].tax_amount === null);
    assert.ok(doc.inference.prediction.fields.get("line_items").values[0].tax_rate === null);
    assert.strictEqual(doc.inference.prediction.fields.get("line_items").values[0].total_amount, "2.63");
    assert.ok(doc.inference.prediction.fields.get("line_items").values[0].unit_price === null);
    assert.strictEqual(doc.inference.prediction.fields.get("line_items").values[6].unit_price, "65.0");
    assert.strictEqual(doc.inference.prediction.fields.get("line_items").values[6].quantity, "1.0");
    assert.ok(doc.inference.prediction.fields.get("locale") instanceof GeneratedObjectField);
    assert.strictEqual(doc.inference.prediction.fields.get("locale").currency, "EUR");
    assert.strictEqual(doc.inference.prediction.fields.get("locale").language, "fr");
    assert.strictEqual(doc.inference.prediction.fields.get("reference_numbers").values[0].value, "AD29094");
    assert.strictEqual(doc.inference.prediction.fields.get("supplier_address").value,
      "156 University Ave, Toronto ON, Canada M5H 2H7"
    );
    assert.strictEqual(doc.inference.prediction.fields.get("supplier_company_registrations").values.length, 0);
    assert.strictEqual(doc.inference.prediction.fields.get("supplier_name").value, "TURNPIKE DESIGNS CO.");
    assert.strictEqual(doc.inference.prediction.fields.get("supplier_payment_details").values[0].iban,
      "FR7640254025476501124705368"
    );
    assert.deepStrictEqual(doc.inference.prediction.fields.get("taxes").values[0].polygon.polygon,
      [[0.292, 0.749], [0.543, 0.749], [0.543, 0.763], [0.292, 0.763]]
    );
    assert.strictEqual(doc.inference.prediction.fields.get("taxes").values[0].rate, "20.0");
    assert.strictEqual(doc.inference.prediction.fields.get("taxes").values[0].value, "97.98");
    assert.strictEqual(doc.inference.prediction.fields.get("total_amount").value, "587.95");
    assert.strictEqual(doc.inference.prediction.fields.get("total_net").value, "489.97");
    const docString = await fs.readFile(path.join(dataPathInvoice.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });
});


describe("Generated Document Object initialization on an International ID", async () => {

  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInternationalId.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.v1.Document(GeneratedV1, response.document);
    const docString = await fs.readFile(path.join(dataPathInternationalId.emptyDocString));
    assert.ok(doc.inference.prediction.fields.get("document_type") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("document_type").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("document_number") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("document_number").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("country_of_issue") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("country_of_issue").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("surnames") instanceof GeneratedListField);
    assert.strictEqual(doc.inference.prediction.fields.get("surnames").values.length, 0);
    assert.ok(doc.inference.prediction.fields.get("given_names") instanceof GeneratedListField);
    assert.strictEqual(doc.inference.prediction.fields.get("given_names").values.length, 0);
    assert.ok(doc.inference.prediction.fields.get("sex") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("sex").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("birth_date") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("birth_date").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("birth_place") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("birth_place").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("nationality") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("nationality").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("issue_date") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("issue_date").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("expiry_date") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("expiry_date").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("address") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("address").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("mrz1") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("mrz1").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("mrz2") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("mrz2").value, undefined);
    assert.ok(doc.inference.prediction.fields.get("mrz3") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("mrz3").value, undefined);

    assert.strictEqual(doc.toString(), docString.toString());
  });

  it("should load a complete document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInternationalId.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.v1.Document(GeneratedV1, response.document);
    assert.ok(doc.inference.prediction.fields.get("document_type") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("document_type").value, "NATIONAL_ID_CARD");
    assert.ok(doc.inference.prediction.fields.get("document_number") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("document_number").value, "99999999R");
    assert.ok(doc.inference.prediction.fields.get("country_of_issue") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("country_of_issue").value, "ESP");
    assert.ok(doc.inference.prediction.fields.get("surnames") instanceof GeneratedListField);
    assert.strictEqual(doc.inference.prediction.fields.get("surnames").values[0].value, "ESPAÑOLA");
    assert.strictEqual(doc.inference.prediction.fields.get("surnames").values[1].value, "ESPAÑOLA");
    assert.ok(doc.inference.prediction.fields.get("given_names") instanceof GeneratedListField);
    assert.strictEqual(doc.inference.prediction.fields.get("given_names").values[0].value, "CARMEN");
    assert.ok(doc.inference.prediction.fields.get("sex") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("sex").value, "F");
    assert.ok(doc.inference.prediction.fields.get("birth_date") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("birth_date").value, "1980-01-01");
    assert.ok(doc.inference.prediction.fields.get("birth_place") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("birth_place").value, "MADRID");
    assert.ok(doc.inference.prediction.fields.get("nationality") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("nationality").value, "ESP");
    assert.ok(doc.inference.prediction.fields.get("issue_date") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("issue_date").value, "2015-01-01");
    assert.ok(doc.inference.prediction.fields.get("expiry_date") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("expiry_date").value, "2025-01-01");
    assert.ok(doc.inference.prediction.fields.get("address") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("address").value, "AVDA DE MADRID S-N MADRID MADRID");
    assert.ok(doc.inference.prediction.fields.get("mrz1") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("mrz1").value, "IDESPBAA000589599999999R<<<<<<");
    assert.ok(doc.inference.prediction.fields.get("mrz2") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("mrz2").value, "8001014F2501017ESP<<<<<<<<<<<7");
    assert.ok(doc.inference.prediction.fields.get("mrz3") instanceof StringField);
    assert.strictEqual(doc.inference.prediction.fields.get("mrz3").value, "ESPANOLA<ESPANOLA<<CARMEN<<<<<<");
    const docString = await fs.readFile(path.join(dataPathInternationalId.docString));
    assert.strictEqual(doc.toString(), docString.toString());
  });
});
