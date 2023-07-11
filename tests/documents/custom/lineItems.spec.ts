import { promises as fs } from "fs";
import { expect } from "chai";
import { CustomV1 } from "../../../src/product";
import { getLineItems } from "../../../src/parsing/custom";

const dataPath = {
  singleTable01:
    "tests/data/custom/response_v1/line_items/single_table_01.json",
};

describe("Custom Document Line Items", async () => {
  it("with valid custom document V1 must build 3 lines", async () => {
    const jsonData = await fs.readFile(dataPath.singleTable01);

    const response = JSON.parse(jsonData.toString());
    const doc = new CustomV1({
      prediction: response.document.inference.prediction,
    });

    const anchorNames: string[] = [];
    anchorNames.push("beneficiary_name");

    const fieldNamesToLineItems: string[] = [];
    fieldNamesToLineItems.push(
      "beneficiary_birth_date",
      "beneficiary_number",
      "beneficiary_name",
      "beneficiary_rank"
    );

    const lineItems = getLineItems(
      anchorNames,
      0.011,
      fieldNamesToLineItems,
      doc.fields
    );

    expect(lineItems).to.not.null;
    expect(lineItems.rows.length).to.be.eq(3);
    const firstLine = lineItems.rows[0];
    expect(firstLine.bbox[0]).to.be.eq(0.059);
    expect(firstLine.bbox[1]).to.be.eq(0.351);
    expect(firstLine.bbox[2]).to.be.eq(0.3);
    expect(firstLine.bbox[3]).to.be.eq(0.36);
    expect(firstLine.fields.size).to.be.eq(4);
    expect(firstLine.fields.has("beneficiary_birth_date")).to.be.true;
    expect(firstLine.fields.has("beneficiary_number")).to.be.true;
    expect(firstLine.fields.has("beneficiary_name")).to.be.true;
    expect(firstLine.fields.has("beneficiary_rank")).to.be.true;
    expect(
      lineItems.rows[1].fields.get("beneficiary_number")?.confidence
    ).to.be.eq(0.5);
    expect(
      lineItems.rows[1].fields.get("beneficiary_birth_date")?.content
    ).to.be.eq("2010-07-18");
    expect(lineItems.rows[2].fields.size).to.be.eq(4);
    expect(lineItems.rows[2].fields.get("beneficiary_rank")?.content).to.be.eq(
      "3"
    );
  });
});
