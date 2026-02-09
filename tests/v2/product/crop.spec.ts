import { expect } from "chai";
import path from "node:path";
import { V2_PRODUCT_PATH } from "../../index.js";
import { CropResponse } from "@/v2/product/index.js";
import { loadV2Response } from "./utils.js";

describe("MindeeV2 - Crop Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      CropResponse,
      path.join(V2_PRODUCT_PATH, "crop", "crop_single.json")
    );
    const crops = response.inference.result.crops;
    expect(crops).to.be.an("array").that.has.lengthOf(1);
  });

  it("should load multiple results", async () => {
    const response = await loadV2Response(
      CropResponse,
      path.join(V2_PRODUCT_PATH, "crop", "crop_multiple.json")
    );
    const crops = response.inference.result.crops;
    expect(crops).to.be.an("array").that.has.lengthOf(2);
  });
});
