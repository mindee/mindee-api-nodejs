import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("MindeeV1 - Optional Dependencies #OptionalDepsRemoved", function () {

  const modules = [
    "sharp",
    "pdf.js-extract",
    "@cantoo/pdf-lib",
    "node-poppler",
  ];

  for (const moduleName of modules) {
    it(`should NOT have ${moduleName} installed`, async function () {
      try {
        await import(moduleName);
        assert.fail("sharp should not be installed in this environment, but it was found!");
      } catch (error: any) {
        const binaryMissing = error.message
          && error.code === "ERR_MODULE_NOT_FOUND"
          && error.message.includes(`Could not load the "${moduleName}" module`);
        if (!binaryMissing) {
          throw error;
        }
      }
    });
  }
});
