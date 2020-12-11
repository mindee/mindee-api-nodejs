const Input = require("../mindee/inputs");
const path = require("path");
const fs = require("fs").promises;
const expect = require("chai").expect;
const { PDFDocument } = require("pdf-lib");

describe("Test different types of input", () => {
  it("should accept base64 inputs", async () => {
    const b64String = await fs.readFile(
      path.join(__dirname, "data/receipts/receipt.jpg"),
      { encoding: "base64" }
    );
    const filename = "test.jpg";
    const input = new Input({
      file: b64String,
      inputType: "base64",
      filename: filename,
    });
    await input.init();
    expect(input.inputType).to.equals("base64");
    expect(input.filename).to.equals(filename);
    expect(input.fileObject).to.eqls(b64String);
  });

  it("should accept files with a path", async () => {
    const input = new Input({
      file: path.join(__dirname, "data/receipts/receipt.jpg"),
      inputType: "path",
    });
    await input.init();
    const expectedResult = await fs.readFile(
      path.join(__dirname, "data/receipts/receipt.jpg")
    );
    expect(input.inputType).to.equals("path");
    expect(input.filename).to.equals("receipt.jpg");
    expect(input.fileExtension).to.equals("image/jpg");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should create a dummy file", async () => {
    const input = new Input({ inputType: "dummy" });
    await input.init();
    expect(input.inputType).to.equals("dummy");
    expect(input.filename).to.equals("");
  });

  it("should cut pdf", async () => {
    const input = new Input({
      file: path.join(__dirname, "data/invoices/invoice_6p.pdf"),
      inputType: "path",
    });
    await input.init();
    const pdfDocument = await PDFDocument.load(input.fileObject);
    const pdfLength = pdfDocument.getPageCount();
    expect(input.inputType).to.equals("path");
    expect(input.filename).to.equals("invoice_6p.pdf");
    expect(input.fileExtension).to.equals("application/pdf");
    expect(pdfLength).to.be.equal(input.CUT_PDF_SIZE);
  });

  it("should not cut pdf", async () => {
    const input = new Input({
      file: path.join(__dirname, "data/invoices/invoice.pdf"),
      inputType: "path",
    });
    await input.init();
    const expectedResult = await fs.readFile(
      path.join(__dirname, "data/invoices/invoice.pdf")
    );
    expect(input.inputType).to.equals("path");
    expect(input.filename).to.equals("invoice.pdf");
    expect(input.fileExtension).to.equals("application/pdf");
    expect(input.fileObject).to.eql(expectedResult);
  });
});
