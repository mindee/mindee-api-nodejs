import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BytesInput, UrlInput } from "@/index.js";
import { LocalInputSource } from "@/input/index.js";
import { MockAgent, setGlobalDispatcher } from "undici";

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get("https://dummy-host");

describe("Input Sources - URL input source", () => {
  describe("initializing", () => {
    it("should accept a URL", async () => {
      const input = new UrlInput({
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ReceiptSwiss.jpg/576px-ReceiptSwiss.jpg",
        dispatcher: mockAgent,
      });
      await input.init();
      assert.strictEqual(typeof input.fileObject, "string");
    });

    it("should throw an error for non-HTTPS URL", async () => {
      const url = "http://dummy-host/file.pdf";
      const urlSource = new UrlInput({ url, dispatcher: mockAgent });

      try {
        await urlSource.init();
        assert.fail("Expected an error to be thrown");
      } catch (error) {
        assert.ok(error instanceof Error);
        assert.strictEqual((error as Error).message, "URL must be HTTPS");
      }
    });


    describe("asLocalInputSource", () => {

      it("should download file and return LocalInputSource", async () => {
        const url = "https://dummy-host/file.pdf";
        const fileContent = Buffer.from("dummy PDF content");

        mockPool
          .intercept({ path: "/file.pdf", method: "GET" })
          .reply(200, fileContent);

        const urlInput = new UrlInput({ url, dispatcher: mockAgent });
        await urlInput.init();
        const localInput = await urlInput.asLocalInputSource();
        await localInput.init();

        assert.ok(localInput instanceof BytesInput);
        assert.strictEqual(localInput.filename, "file.pdf");
        assert.strictEqual(localInput.fileObject.toString(), fileContent.toString());
      });

      it("should handle redirects", async () => {
        const originalUrl = "https://dummy-host/original.pdf";
        const redirectUrl = "https://dummy-host/redirected.pdf";
        const fileContent = Buffer.from("redirected PDF content");

        mockPool
          .intercept({ path: "/original.pdf", method: "GET" })
          .reply(
            302,
            "",
            {
              headers: { location: redirectUrl }
            }
          );

        mockPool
          .intercept({ path: "/redirected.pdf", method: "GET" })
          .reply(200, fileContent);

        const urlInput = new UrlInput({ url: originalUrl, dispatcher: mockAgent });
        const localInput = await urlInput.asLocalInputSource();
        await localInput.init();

        assert.ok(localInput instanceof LocalInputSource);
        assert.strictEqual(localInput.filename, "redirected.pdf");
        assert.deepStrictEqual(localInput.fileObject, fileContent);
      });

      it("should throw an error for HTTP error responses", async () => {
        const url = "https://dummy-host/not-found.pdf";

        mockPool
          .intercept({ path: "/not-found.pdf", method: "GET" })
          .reply(404, "");

        const urlInput = new UrlInput({ url, dispatcher: mockAgent });

        try {
          await urlInput.asLocalInputSource();
          assert.fail("Expected an error to be thrown");
        } catch (error) {
          assert.ok(error instanceof Error);
          assert.strictEqual(
            (error as Error).message,
            "Couldn't retrieve file from server, error code 404."
          );
        }
      });

      it("should use provided filename", async () => {
        const url = "https://dummy-host/file.pdf";
        const fileContent = Buffer.from("dummy PDF content");

        mockPool
          .intercept({ path: "/file.pdf", method: "GET" })
          .reply(200, fileContent);

        const urlInput = new UrlInput({ url, dispatcher: mockAgent });
        const localInput = await urlInput.asLocalInputSource({ filename: "custom.pdf" });
        await localInput.init();

        assert.strictEqual(localInput.filename, "custom.pdf");
      });

      it("should throw an error for invalid filename", async () => {
        mockPool
          .intercept({ path: "/file.pdf", method: "GET" })
          .reply(200, "toto");

        const url = "https://dummy-host/file.pdf";
        const urlInput = new UrlInput({ url, dispatcher: mockAgent });

        try {
          const localInput = await urlInput.asLocalInputSource({ filename: "invalid" });
          await localInput.init();
          assert.fail("Expected an error to be thrown");
        } catch (error) {
          assert.ok(error instanceof Error);
          assert.strictEqual(
            (error as Error).message,
            "Invalid file type, must be one of .pdf, .heic, .jpg, .jpeg, .png, .tif, .tiff, .webp."
          );
        }
      });
    });
  });
});
