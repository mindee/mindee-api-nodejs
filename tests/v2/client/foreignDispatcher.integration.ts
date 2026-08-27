import { before, describe, it } from "node:test";
import assert from "node:assert/strict";

// IMPORTANT: this file must NOT statically import "undici" or the SDK.
// This test showcases how the library previously behaved and broke when reusing a foreign global dispatcher.

describe(
  "MindeeV2 – Integration – foreign global dispatcher",
  { timeout: 120000 },
  () => {
    let apiKey: string;
    let modelId: string;
    let pdfBuffer: Buffer;
    let undici: typeof import("undici");
    let mindee: typeof import("@/index.js");
    let mindeeHttp: typeof import("@/v2/http/index.js");
    let foreignDispatcher: import("undici").Dispatcher;

    before(async () => {
      apiKey = process.env["MINDEE_V2_API_KEY"] ?? "";
      modelId = process.env["MINDEE_V2_SE_TESTS_FINDOC_MODEL_ID"] ?? "";
      const pdfUrl =
        process.env["MINDEE_V2_SE_TESTS_BLANK_PDF_URL"] ?? "error-no-url-found";

      const response = await fetch(pdfUrl);
      assert.ok(response.ok, `Failed to download the test PDF from: ${pdfUrl}`);
      pdfBuffer = Buffer.from(await response.arrayBuffer());

      undici = await import("undici");
      mindee = await import("@/index.js");
      mindeeHttp = await import("@/v2/http/index.js");

      foreignDispatcher = undici.getGlobalDispatcher();
      assert.ok(
        !(foreignDispatcher instanceof undici.Dispatcher),
        "Expected the global dispatcher to belong to Node's built-in undici." +
          " Check that nothing loads npm undici before the first fetch call."
      );
    });

    it("repro: enqueueing through the foreign dispatcher fails with a transport error", async () => {
      const client = new mindee.Client({
        apiKey: apiKey,
        dispatcher: foreignDispatcher,
      });
      const source = new mindee.BufferInput({
        buffer: pdfBuffer,
        filename: "blank.pdf",
      });
      await assert.rejects(
        client.enqueue(mindee.product.Extraction, source, { modelId: modelId }),
        (err: unknown) => {
          assert.ok(!(err instanceof mindeeHttp.MindeeHttpErrorV2));
          return true;
        }
      );
    });

    it("fix: the default client ignores the foreign dispatcher and succeeds", async () => {
      const client = new mindee.Client({ apiKey: apiKey });
      const source = new mindee.BufferInput({
        buffer: pdfBuffer,
        filename: "blank.pdf",
      });
      const response = await client.enqueue(
        mindee.product.Extraction, source, { modelId: modelId }
      );
      assert.ok(response.job.id);
    });
  }
);
