import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";
import { Page } from "../../../src";
import { GeneratedV1 } from "../../../src/product";
import { GeneratedListField, GeneratedObjectField } from "../../../src/parsing/generated";
import { GeneratedV1Page } from "../../../src/product/generated/generatedV1Page";
import { StringField } from "../../../src/parsing/standard";

const dataPathInternationalId = {
  complete: "tests/data/products/generated/response_v1/complete_international_id_v1.json",
  empty: "tests/data/products/generated/response_v1/empty_international_id_v1.json",
  docString: "tests/data/products/generated/response_v1/summary_full_international_id_v1.rst",
  page0String: "tests/data/products/generated/response_v1/summary_page0_international_id_v1.rst",
  emptyDocString: "tests/data/products/generated/response_v1/summary_empty_international_id_v1.rst"
};

const dataPathInvoice = {
  complete: "tests/data/products/generated/response_v1/complete_invoice_v4.json",
  empty: "tests/data/products/generated/response_v1/empty_invoice_v4.json",
  docString: "tests/data/products/generated/response_v1/summary_full_invoice_v4.rst",
  page0String: "tests/data/products/generated/response_v1/summary_page0_invoice_v4.rst",
  emptyDocString: "tests/data/products/generated/response_v1/summary_empty_invoice_v4.rst"
};


describe("Generated Document Object initialization on an OTS invoice", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInvoice.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.Document(GeneratedV1, response.document);
    expect(doc.inference.prediction.fields.get('customer_address').value).to.be.undefined;
    expect(doc.inference.prediction.fields.get('customer_company_registrations').values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get('customer_name').value).to.be.undefined;
    expect(doc.inference.prediction.fields.get('date').value).to.be.undefined;
    expect(doc.inference.prediction.fields.get('document_type').value).to.equals("INVOICE");
    expect(doc.inference.prediction.fields.get('due_date').value).be.undefined;
    expect(doc.inference.prediction.fields.get('invoice_number').value).be.undefined;
    expect(doc.inference.prediction.fields.get('line_items')).to.be.an.instanceOf(GeneratedListField)
    expect(doc.inference.prediction.fields.get('line_items').values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get('locale')).to.be.an.instanceOf(GeneratedObjectField);
    expect(doc.inference.prediction.fields.get('locale').currency).to.be.null;
    expect(doc.inference.prediction.fields.get('locale').language).to.be.null;
    expect(doc.inference.prediction.fields.get('reference_numbers').values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get('supplier_address').value).to.be.undefined;
    expect(doc.inference.prediction.fields.get('supplier_company_registrations').values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get('supplier_name').value).to.be.undefined;
    expect(doc.inference.prediction.fields.get('supplier_payment_details').values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get('taxes').values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get('total_amount').value).to.be.undefined;
    expect(doc.inference.prediction.fields.get('total_net').value).to.be.undefined;
    const docString = await fs.readFile(path.join(dataPathInvoice.emptyDocString));
    expect(doc.toString()).to.equals(docString.toString());
  });

  it("should load a single page prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInvoice.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const page = new Page(GeneratedV1Page, response.document.inference.pages[0], 0);
    expect(page.prediction.fields.get('customer_address').value).to.be.undefined;
    expect(page.prediction.fields.get('customer_company_registrations').values.length).to.equals(0);
    expect(page.prediction.fields.get('customer_name').value).to.be.undefined;
    expect(page.prediction.fields.get('date').value).to.equals('2020-02-17');
    expect(page.prediction.fields.get('document_type').value).to.equals('INVOICE');
    expect(page.prediction.fields.get('due_date').value).to.equals('2020-02-17');
    expect(page.prediction.fields.get('invoice_number').value).to.equals('0042004801351');
    expect(page.prediction.fields.get('line_items')).to.be.an.instanceOf(GeneratedListField)
    expect(page.prediction.fields.get('line_items').values[0]).to.be.an.instanceOf(GeneratedObjectField)
    expect(page.prediction.fields.get('line_items').values[0].description).to.equals('S)BOIE 5X500 FEUILLES A4');
    expect(page.prediction.fields.get('line_items').values[0].product_code).to.be.null;
    expect(page.prediction.fields.get('line_items').values[0].quantity).to.be.null;
    expect(page.prediction.fields.get('line_items').values[0].tax_amount).to.be.null;
    expect(page.prediction.fields.get('line_items').values[0].tax_rate).to.be.null;
    expect(page.prediction.fields.get('line_items').values[0].total_amount).to.equals("2.63");
    expect(page.prediction.fields.get('line_items').values[0].unit_price).to.be.null;
    expect(page.prediction.fields.get('locale')).to.be.an.instanceOf(GeneratedObjectField);
    expect(page.prediction.fields.get('locale').currency).to.equals('EUR');
    expect(page.prediction.fields.get('locale').language).to.equals('fr');
    expect(page.prediction.fields.get('reference_numbers').values.length).to.equals(0);
    expect(page.prediction.fields.get('supplier_address').value).to.be.undefined;
    expect(page.prediction.fields.get('supplier_company_registrations').values.length).to.equals(0);
    expect(page.prediction.fields.get('supplier_name').value).to.be.undefined;
    expect(page.prediction.fields.get('supplier_payment_details').values[0].iban).to.equals('FR7640254025476501124705368');
    expect(page.prediction.fields.get('taxes').values[0].polygon.polygon).to.have.deep.members([[0.292, 0.749], [0.543, 0.749], [0.543, 0.763], [0.292, 0.763]]);
    expect(page.prediction.fields.get('taxes').values[0].rate).to.equals('20.0');
    expect(page.prediction.fields.get('taxes').values[0].value).to.equals('97.98');
    expect(page.prediction.fields.get('total_amount').value).to.equals('587.95');
    expect(page.prediction.fields.get('total_net').value).to.equals('489.97');
    const page0String = await fs.readFile(path.join(dataPathInvoice.page0String));
    expect(page.toString()).to.equals(page0String.toString());
  });

  it("should load a complete document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInvoice.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.Document(GeneratedV1, response.document);
    expect(doc.inference.prediction.fields.get('customer_address').value).to.equals('1954 Bloon Street West Toronto, ON, M6P 3K9 Canada');
    expect(doc.inference.prediction.fields.get('customer_company_registrations').values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get('customer_name').value).to.equals('JIRO DOI');
    expect(doc.inference.prediction.fields.get('date').value).to.equals('2020-02-17');
    expect(doc.inference.prediction.fields.get('document_type').value).to.equals('INVOICE');
    expect(doc.inference.prediction.fields.get('due_date').value).to.equals('2020-02-17');
    expect(doc.inference.prediction.fields.get('invoice_number').value).to.equals('0042004801351');
    expect(doc.inference.prediction.fields.get('line_items')).to.be.an.instanceOf(GeneratedListField)
    expect(doc.inference.prediction.fields.get('line_items').values[0]).to.be.an.instanceOf(GeneratedObjectField)
    expect(doc.inference.prediction.fields.get('line_items').values[0].description).to.equals('S)BOIE 5X500 FEUILLES A4');
    expect(doc.inference.prediction.fields.get('line_items').values[0].product_code).to.be.null;
    expect(doc.inference.prediction.fields.get('line_items').values[0].quantity).to.be.null;
    expect(doc.inference.prediction.fields.get('line_items').values[0].tax_amount).to.be.null;
    expect(doc.inference.prediction.fields.get('line_items').values[0].tax_rate).to.be.null;
    expect(doc.inference.prediction.fields.get('line_items').values[0].total_amount).to.equals("2.63");
    expect(doc.inference.prediction.fields.get('line_items').values[0].unit_price).to.be.null;
    expect(doc.inference.prediction.fields.get('line_items').values[6].unit_price).to.equals("65.0");
    expect(doc.inference.prediction.fields.get('line_items').values[6].quantity).to.equals('1.0');
    expect(doc.inference.prediction.fields.get('locale')).to.be.an.instanceOf(GeneratedObjectField);
    expect(doc.inference.prediction.fields.get('locale').currency).to.equals('EUR');
    expect(doc.inference.prediction.fields.get('locale').language).to.equals('fr');
    expect(doc.inference.prediction.fields.get('reference_numbers').values[0].value).to.equals('AD29094');
    expect(doc.inference.prediction.fields.get('supplier_address').value).to.equals('156 University Ave, Toronto ON, Canada M5H 2H7');
    expect(doc.inference.prediction.fields.get('supplier_company_registrations').values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get('supplier_name').value).to.equals('TURNPIKE DESIGNS CO.');
    expect(doc.inference.prediction.fields.get('supplier_payment_details').values[0].iban).to.equals('FR7640254025476501124705368');
    expect(doc.inference.prediction.fields.get('taxes').values[0].polygon.polygon).to.have.deep.members([[0.292, 0.749], [0.543, 0.749], [0.543, 0.763], [0.292, 0.763]]);
    expect(doc.inference.prediction.fields.get('taxes').values[0].rate).to.equals('20.0');
    expect(doc.inference.prediction.fields.get('taxes').values[0].value).to.equals('97.98');
    expect(doc.inference.prediction.fields.get('total_amount').value).to.equals('587.95');
    expect(doc.inference.prediction.fields.get('total_net').value).to.equals('489.97');
    const docString = await fs.readFile(path.join(dataPathInvoice.docString));
    expect(doc.toString()).to.equals(docString.toString());
  });
});


describe("Generated Document Object initialization on an International ID", async () => {

  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInternationalId.empty));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.Document(GeneratedV1, response.document);
    const docString = await fs.readFile(path.join(dataPathInternationalId.emptyDocString));
    expect(doc.inference.prediction.fields.get("document_type")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("document_type").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("document_number")).be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("document_number").value).be.undefined;
    expect(doc.inference.prediction.fields.get("country_of_issue")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("country_of_issue").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("surnames")).to.be.an.instanceOf(GeneratedListField);
    expect(doc.inference.prediction.fields.get("surnames").values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get("given_names")).to.be.an.instanceOf(GeneratedListField);
    expect(doc.inference.prediction.fields.get("given_names").values.length).to.equals(0);
    expect(doc.inference.prediction.fields.get("sex")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("sex").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("birth_date")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("birth_date").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("birth_place")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("birth_place").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("nationality")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("nationality").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("issue_date")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("issue_date").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("expiry_date")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("expiry_date").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("address")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("address").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("mrz1")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("mrz1").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("mrz2")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("mrz2").value).to.be.undefined;
    expect(doc.inference.prediction.fields.get("mrz3")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("mrz3").value).to.be.undefined;

    expect(doc.toString()).to.equals(docString.toString());
  });

  it("should load a complete document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInternationalId.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.Document(GeneratedV1, response.document);
    expect(doc.inference.prediction.fields.get("document_type")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("document_type").value).to.equals("NATIONAL_ID_CARD");
    expect(doc.inference.prediction.fields.get("document_number")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("document_number").value).to.equals("99999999R");
    expect(doc.inference.prediction.fields.get("country_of_issue")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("country_of_issue").value).to.equals("ESP");
    expect(doc.inference.prediction.fields.get("surnames")).to.be.an.instanceOf(GeneratedListField);
    expect(doc.inference.prediction.fields.get("surnames").values[0].value).to.equals("ESPAÑOLA");
    expect(doc.inference.prediction.fields.get("surnames").values[1].value).to.equals("ESPAÑOLA");
    expect(doc.inference.prediction.fields.get("given_names")).to.be.an.instanceOf(GeneratedListField);
    expect(doc.inference.prediction.fields.get("given_names").values[0].value).to.equals("CARMEN");
    expect(doc.inference.prediction.fields.get("sex")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("sex").value).to.equals("F");
    expect(doc.inference.prediction.fields.get("birth_date")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("birth_date").value).to.equals("1980-01-01");
    expect(doc.inference.prediction.fields.get("birth_place")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("birth_place").value).to.equals("MADRID");
    expect(doc.inference.prediction.fields.get("nationality")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("nationality").value).to.equals("ESP");
    expect(doc.inference.prediction.fields.get("issue_date")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("issue_date").value).to.equals("2015-01-01");
    expect(doc.inference.prediction.fields.get("expiry_date")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("expiry_date").value).to.equals("2025-01-01");
    expect(doc.inference.prediction.fields.get("address")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("address").value).to.equals("AVDA DE MADRID S-N MADRID MADRID");
    expect(doc.inference.prediction.fields.get("mrz1")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("mrz1").value).to.equals("IDESPBAA000589599999999R<<<<<<");
    expect(doc.inference.prediction.fields.get("mrz2")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("mrz2").value).to.equals("8001014F2501017ESP<<<<<<<<<<<7");
    expect(doc.inference.prediction.fields.get("mrz3")).to.be.an.instanceOf(StringField);
    expect(doc.inference.prediction.fields.get("mrz3").value).to.equals("ESPANOLA<ESPANOLA<<CARMEN<<<<<<");
    const docString = await fs.readFile(path.join(dataPathInternationalId.docString));
    expect(doc.toString()).to.equals(docString.toString());
  });
});
