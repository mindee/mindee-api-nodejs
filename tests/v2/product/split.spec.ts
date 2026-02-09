import { expect } from "chai";
import path from "node:path";
import { split } from "@/v2/product/index.js";

import { V2_PRODUCT_PATH } from "../../index.js";
import { loadV2Response } from "./utils.js";


describe("MindeeV2 - Split Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      split.SplitResponse,
      path.join(V2_PRODUCT_PATH, "split", "split_single.json")
    );
    const splits: split.SplitRange[] = response.inference.result.splits;
    expect(splits).to.be.an("array").that.has.lengthOf(1);

    const firstSplit: split.SplitRange = splits[0];
    expect(firstSplit.documentType).to.equal("receipt");

    expect(firstSplit.pageRange).to.be.an("array").that.has.lengthOf(2);
    expect(firstSplit.pageRange[0]).to.equal(0);
    expect(firstSplit.pageRange[1]).to.equal(0);
  });

  it("should load multiple results", async () => {
    const response = await loadV2Response(
      split.SplitResponse,
      path.join(V2_PRODUCT_PATH, "split", "split_multiple.json")
    );
    const splits: split.SplitRange[] = response.inference.result.splits;
    expect(splits).to.be.an("array").that.has.lengthOf(3);

    const firstSplit: split.SplitRange = splits[0];
    expect(firstSplit.documentType).to.equal("invoice");
    expect(firstSplit.pageRange).to.be.an("array").that.has.lengthOf(2);
    expect(firstSplit.pageRange[0]).to.equal(0);
    expect(firstSplit.pageRange[1]).to.equal(0);

    const secondSplit: split.SplitRange = splits[1];
    expect(secondSplit.documentType).to.equal("invoice");
    expect(secondSplit.pageRange).to.be.an("array").that.has.lengthOf(2);
    expect(secondSplit.pageRange[0]).to.equal(1);
    expect(secondSplit.pageRange[1]).to.equal(3);
  });
});
