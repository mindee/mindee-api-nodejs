import { promises as fs } from "fs";
import * as path from "path";
import { expect } from "chai";
import * as mindee from "../../../src";
import { GeneratedV1Document } from "../../../src/product/generated/generatedV1Document";
import { Page } from "../../../src/parsing/common";
import { CropperExtra } from "../../../src/parsing/common/extras/cropperExtra";
import { GeneratedV1 } from "../../../src/product";
import { PositionField, StringField } from "../../../src/parsing/standard";
import { GeneratedListField, GeneratedObjectField } from "../../../src/parsing/generated";

const dataPathInternationalId = {
  conplete: "tests/data/products/generated/response_v1/complete_international_id_v1.json",
  empty: "tests/data/products/generated/response_v1/empty_international_id_v1.json",
  docString: "tests/data/products/generated/response_v1/summary_full_international_id_v1.rst",
  page0String: "tests/data/products/generated/response_v1/summary_page0_international_id_v1.rst"
};

const dataPathInvoice = {
  complete: "tests/data/products/generated/response_v1/complete_invoice_v4.json",
  empty: "tests/data/products/generated/response_v1/empty_invoice_v4.json",
  docString: "tests/data/products/generated/response_v1/summary_full_invoice_v4.rst",
  page0String: "tests/data/products/generated/response_v1/summary_page0_invoice_v4.rst",
};


describe("Generated Document Object initialization on an OTS product", async () => {
  it("should load an empty document prediction", async () => {
    const jsonDataNA = await fs.readFile(path.resolve(dataPathInvoice.complete));
    const response = JSON.parse(jsonDataNA.toString());
    const doc = new mindee.Document(GeneratedV1, response.document);
    expect((doc.inference.prediction.fields.get('customer_address') as StringField).value).to.equal('1954 Bloon Street West Toronto, ON, M6P 3K9 Canada');

    const docString = await fs.readFile(path.join(dataPathInvoice.docString));
    expect(doc.toString()).to.be.equals(docString.toString());
  });
});
