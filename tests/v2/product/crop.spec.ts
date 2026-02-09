import { expect } from "chai";
import path from "node:path";
import { V2_PRODUCT_PATH } from "../../index.js";
import { CropResponse, CropItem } from "@/v2/product/index.js";
import { loadV2Response } from "./utils.js";
import { Polygon } from "@/geometry/index.js";

describe("MindeeV2 - Crop Response", async () => {
  it("should load a single result", async () => {
    const response = await loadV2Response(
      CropResponse,
      path.join(V2_PRODUCT_PATH, "crop", "crop_single.json")
    );
    // Validate inference metadata
    expect(response.inference.id).to.equal("12345678-1234-1234-1234-123456789abc");
    expect(response.inference.model.id).to.equal("test-model-id");

    // Validate file metadata
    expect(response.inference.file.name).to.equal("sample.jpeg");
    expect(response.inference.file.pageCount).to.equal(1);
    expect(response.inference.file.mimeType).to.equal("image/jpeg");

    // Validate crops
    const crops = response.inference.result.crops;
    expect(crops).to.be.an("array").that.has.lengthOf(1);

    const crop: CropItem = crops[0];
    expect(crop.objectType).to.equal("invoice");
    expect(crop.location.page).to.equal(0);

    const polygon: Polygon = crop.location.polygon!;
    expect(polygon.length).to.equal(4);
    expect(polygon.length).to.equal(4);
    expect(polygon[0][0]).to.equal(0.15);
    expect(polygon[0][1]).to.equal(0.254);
    expect(polygon[1][0]).to.equal(0.85);
    expect(polygon[1][1]).to.equal(0.254);
    expect(polygon[2][0]).to.equal(0.85);
    expect(polygon[2][1]).to.equal(0.947);
    expect(polygon[3][0]).to.equal(0.15);
    expect(polygon[3][1]).to.equal(0.947);
  });

  it("should load multiple results", async () => {
    const response = await loadV2Response(
      CropResponse,
      path.join(V2_PRODUCT_PATH, "crop", "crop_multiple.json")
    );
    // Validate inference metadata
    expect(response.inference.id).to.equal("12345678-1234-1234-1234-123456789abc");
    expect(response.inference.model.id).to.equal("test-model-id");

    // Validate file metadata
    expect(response.inference.file.name).to.equal("default_sample.jpg");
    expect(response.inference.file.pageCount).to.equal(1);
    expect(response.inference.file.mimeType).to.equal("image/jpeg");

    const crops: CropItem[] = response.inference.result.crops;
    expect(crops).to.be.an("array").that.has.lengthOf(2);

    // Validate first crop item
    const firstCrop: CropItem = crops[0];
    expect(firstCrop.objectType).to.equal("invoice");
    expect(firstCrop.location.page).to.equal(0);
    const firstPolygon: Polygon = firstCrop.location.polygon!;
    expect(firstPolygon.length).to.equal(4);
    expect(firstPolygon[0][0]).to.equal(0.214);
    expect(firstPolygon[0][1]).to.equal(0.079);
    expect(firstPolygon[1][0]).to.equal(0.476);
    expect(firstPolygon[1][1]).to.equal(0.079);
    expect(firstPolygon[2][0]).to.equal(0.476);
    expect(firstPolygon[2][1]).to.equal(0.979);
    expect(firstPolygon[3][0]).to.equal(0.214);
    expect(firstPolygon[3][1]).to.equal(0.979);

    // Validate second crop item
    const secondCrop: CropItem = crops[1];
    expect(secondCrop.objectType).to.equal("invoice");
    expect(secondCrop.location.page).to.equal(0);
    const secondPolygon: Polygon = secondCrop.location.polygon!;
    expect(secondPolygon.length).to.equal(4);
    expect(secondPolygon[0][0]).to.equal(0.547);
    expect(secondPolygon[0][1]).to.equal(0.15);
    expect(secondPolygon[1][0]).to.equal(0.862);
    expect(secondPolygon[1][1]).to.equal(0.15);
    expect(secondPolygon[2][0]).to.equal(0.862);
    expect(secondPolygon[2][1]).to.equal(0.97);
    expect(secondPolygon[3][0]).to.equal(0.547);
    expect(secondPolygon[3][1]).to.equal(0.97);
  });
});
