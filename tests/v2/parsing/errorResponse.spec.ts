import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import { describe, it } from "node:test";
import path from "node:path";
import { LocalResponse, ErrorResponse } from "@/v2/parsing/index.js";

import { V2_RESOURCE_PATH } from "../../index.js";

describe("MindeeV2 - Error Response", async () => {

  it("should load and pretty print an error response", async () => {

    const localResponse = new LocalResponse(
      path.join(V2_RESOURCE_PATH, "errors/error_422_invalid_fields.json")
    );
    const response = await localResponse.deserializeResponse(ErrorResponse);

    const rstOutput = await fs.readFile(
      path.join(V2_RESOURCE_PATH, "errors/error_422_invalid_fields.rst"),
      "utf8"
    );

    assert.notStrictEqual(response, undefined);
    assert.notStrictEqual(response, null);
    assert.strictEqual(response.toString(), rstOutput);
  });
});
