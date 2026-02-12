import { expect } from "chai";

describe("Light Environment Sanity Check #lightDeps", function () {

  it("should NOT have sharp installed", async function () {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await import("sharp");
      expect.fail("sharp should not be installed in this environment, but it was found!");
    } catch (error: any) {
      const isModuleNotFound = error.code === "ERR_MODULE_NOT_FOUND";
      const isSharpBinaryMissing = error.message && error.message.includes("Could not load the \"sharp\" module");

      if (!isModuleNotFound && !isSharpBinaryMissing) {
        throw error;
      }
    }
  });

  it("should NOT have pdf.js-extract installed", async function () {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await import("pdf.js-extract");
      expect.fail("pdf.js-extract should not be installed, but it was found!");
    } catch (error: any) {
      expect(error.code).to.equal("ERR_MODULE_NOT_FOUND");
    }
  });

  it("should NOT have @cantoo/pdf-lib installed", async function () {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await import("@cantoo/pdf-lib");
      expect.fail("@cantoo/pdf-lib should not be installed, but it was found!");
    } catch (error: any) {
      expect(error.code).to.equal("ERR_MODULE_NOT_FOUND");
    }
  });
});
