import { expect } from "chai";
import path from "node:path";
import { V2_PRODUCT_PATH } from "../../index.js";
import { SplitResponse } from "@/v2/product/index.js";
import { loadV2Response } from "./utils.js";


describe("MindeeV2 - Split Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      SplitResponse,
      path.join(V2_PRODUCT_PATH, "split", "split_single.json")
    );
    const splits = response.inference.result.splits;
    expect(splits).to.be.an("array").that.has.lengthOf(1);
  });

  it("should load multiple results", async () => {
    const response = await loadV2Response(
      SplitResponse,
      path.join(V2_PRODUCT_PATH, "split", "split_multiple.json")
    );
    const splits = response.inference.result.splits;
    expect(splits).to.be.an("array").that.has.lengthOf(3);
  });
});
