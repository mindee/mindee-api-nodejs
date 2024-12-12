import { BytesInput, LocalInputSource, UrlInput } from "../../src/input";
import { expect } from "chai";
import nock from "nock";

describe("Test URL input source", () => {
  describe("initializing", () => {
    it("should accept a URL", async () => {
      const input = new UrlInput({
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ReceiptSwiss.jpg/576px-ReceiptSwiss.jpg",
      });
      await input.init();
      expect(input.fileObject).to.be.a("string");
    });

    it("should throw an error for non-HTTPS URL", async () => {
      const url = "http://example.com/file.pdf";
      const urlSource = new UrlInput({ url });

      try {
        await urlSource.init();
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.equal("URL must be HTTPS");
      }
    });


    describe("asLocalInputSource", () => {
      beforeEach(() => {
        nock.disableNetConnect();
      });

      afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect();
      });

      it("should download file and return LocalInputSource", async () => {
        const url = "https://example.com/file.pdf";
        const fileContent = Buffer.from("dummy PDF content");

        nock("https://example.com")
          .get("/file.pdf")
          .reply(200, fileContent);

        const urlInput = new UrlInput({ url });
        await urlInput.init();
        const localInput = await urlInput.asLocalInputSource();
        await localInput.init();

        expect(localInput).to.be.instanceOf(BytesInput);
        expect(localInput.filename).to.equal("file.pdf");
        expect(localInput.fileObject.toString()).to.eq(fileContent.toString());
      });

      it("should handle redirects", async () => {
        const originalUrl = "https://example.com/original.pdf";
        const redirectUrl = "https://example.com/redirected.pdf";
        const fileContent = Buffer.from("redirected PDF content");

        nock("https://example.com")
          .get("/original.pdf")
          .reply(302, "", { location: redirectUrl }); // Not sure about that one.

        nock("https://example.com")
          .get("/redirected.pdf")
          .reply(200, fileContent);

        const urlInput = new UrlInput({ url: originalUrl });
        const localInput = await urlInput.asLocalInputSource();
        await localInput.init();

        expect(localInput).to.be.instanceOf(LocalInputSource);
        expect(localInput.filename).to.equal("redirected.pdf");
        expect(localInput.fileObject).to.deep.equal(fileContent);
      });

      it("should throw an error for HTTP error responses", async () => {
        const url = "https://example.com/not-found.pdf";

        nock("https://example.com")
          .get("/not-found.pdf")
          .reply(404);

        const urlInput = new UrlInput({ url });

        try {
          await urlInput.asLocalInputSource();
          expect.fail("Expected an error to be thrown");
        } catch (error) {
          expect(error).to.be.instanceOf(Error);
          expect((error as Error).message).to.equal("Couldn't retrieve file from server, error code 404.");
        }
      });

      it("should use provided filename", async () => {
        const url = "https://example.com/file.pdf";
        const fileContent = Buffer.from("dummy PDF content");

        nock("https://example.com")
          .get("/file.pdf")
          .reply(200, fileContent);

        const urlInput = new UrlInput({ url });
        const localInput = await urlInput.asLocalInputSource({ filename: "custom.pdf" });
        await localInput.init();

        expect(localInput.filename).to.equal("custom.pdf");
      });

      it("should throw an error for invalid filename", async () => {
        nock("https://example.com")
          .get("/file")
          .reply(200, "toto");

        const url = "https://example.com/file";
        const urlInput = new UrlInput({ url });

        try {
          const localInput = await urlInput.asLocalInputSource({ filename: "invalid" });
          await localInput.init();
          expect.fail("Expected an error to be thrown");
        } catch (error) {
          expect(error).to.be.instanceOf(Error);
          expect((error as Error).message).to.equal(
            "Invalid file type, must be one of .pdf, .heic, .jpg, .jpeg, .png, .tif, .tiff, .webp."
          );
        }
      });
    });
  });
});
