import { BytesInput, UrlInput } from "@/index.js";
import { LocalInputSource } from "@/input/index.js";
import { expect } from "chai";
import { MockAgent, setGlobalDispatcher } from "undici";

const mockAgent = new MockAgent();
setGlobalDispatcher(mockAgent);
const mockPool = mockAgent.get("https://dummy-host");

describe("Test URL input source", () => {
  describe("initializing", () => {
    it("should accept a URL", async () => {
      const input = new UrlInput({
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ReceiptSwiss.jpg/576px-ReceiptSwiss.jpg",
        dispatcher: mockAgent,
      });
      await input.init();
      expect(input.fileObject).to.be.a("string");
    });

    it("should throw an error for non-HTTPS URL", async () => {
      const url = "http://dummy-host/file.pdf";
      const urlSource = new UrlInput({ url, dispatcher: mockAgent });

      try {
        await urlSource.init();
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.equal("URL must be HTTPS");
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

        expect(localInput).to.be.instanceOf(BytesInput);
        expect(localInput.filename).to.equal("file.pdf");
        expect(localInput.fileObject.toString()).to.eq(fileContent.toString());
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

        expect(localInput).to.be.instanceOf(LocalInputSource);
        expect(localInput.filename).to.equal("redirected.pdf");
        expect(localInput.fileObject).to.deep.equal(fileContent);
      });

      it("should throw an error for HTTP error responses", async () => {
        const url = "https://dummy-host/not-found.pdf";

        mockPool
          .intercept({ path: "/not-found.pdf", method: "GET" })
          .reply(404, "");

        const urlInput = new UrlInput({ url, dispatcher: mockAgent });

        try {
          await urlInput.asLocalInputSource();
          expect.fail("Expected an error to be thrown");
        } catch (error) {
          expect(error).to.be.instanceOf(Error);
          expect((error as Error).message).to.equal("Couldn't retrieve file from server, error code 404.");
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

        expect(localInput.filename).to.equal("custom.pdf");
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
