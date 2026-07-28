import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasAllOptionalDependencies } from "../helpers/optionalDeps.js";

const hasOptionals = hasAllOptionalDependencies();

describe("MindeeV1 - Optional Dependencies #OptionalDepsRemoved", { skip: hasOptionals }, function () {

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
        if (error?.code !== "ERR_MODULE_NOT_FOUND") {
          throw error;
        }
      }
    });
  }
});
