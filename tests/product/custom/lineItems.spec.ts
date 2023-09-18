import { promises as fs } from "fs";
import { expect } from "chai";
import { CustomV1 } from "../../../src/product";
import { getLineItems } from "../../../src/parsing/custom";

const dataPath = {
  singleTable01:
    "tests/data/products/custom/response_v1/line_items/single_table_01.json",
};

describe("Custom Document Line Items", async () => {
  it("with valid custom document V1 must build 3 lines", async () => {
    const jsonData = await fs.readFile(dataPath.singleTable01);
    const response = JSON.parse(jsonData.toString());
    const doc = new CustomV1({
      prediction: response.document.inference.prediction,
      pages: response.document.inference.pages
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
      fieldNamesToLineItems,
      doc.prediction!.fields,
      0.011
    );

    expect(lineItems).to.not.null;
    expect(lineItems.length).to.be.eq(3);
    const firstLine = lineItems[0];
    expect(firstLine.bbox.xMin).to.be.eq(0.059);
    expect(firstLine.bbox.yMin).to.be.eq(0.351);
    expect(firstLine.bbox.xMax).to.be.eq(0.3);
    expect(firstLine.bbox.yMax).to.be.eq(0.36);
    expect(firstLine.fields.size).to.be.eq(4);
    expect(firstLine.fields.has("beneficiary_birth_date")).to.be.true;
    expect(firstLine.fields.has("beneficiary_number")).to.be.true;
    expect(firstLine.fields.has("beneficiary_name")).to.be.true;
    expect(firstLine.fields.has("beneficiary_rank")).to.be.true;
    expect(
      lineItems[1].fields.get("beneficiary_number")?.confidence
    ).to.be.eq(0.5);
    expect(
      lineItems[1].fields.get("beneficiary_birth_date")?.content
    ).to.be.eq("2010-07-18");
    expect(lineItems[2].fields.size).to.be.eq(4);
    expect(lineItems[2].fields.get("beneficiary_rank")?.content).to.be.eq(
      "3"
    );
  });
});
