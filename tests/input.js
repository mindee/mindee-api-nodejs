const Input = require("../mindee/inputs");
const path = require("path");
const fs = require("fs");
const expect = require("chai").expect;

describe("Test different types of input", () => {
  it("should accept base64 inputs", async () => {
    const b64String = fs.promises.readFile(
      path.join(__dirname, "data/receipt/receipt.jpg"),
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
      file: path.join(__dirname, "data/receipt/receipt.jpg"),
      inputType: "path",
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "data/receipt/receipt.jpg")
    );
    expect(input.inputType).to.equals("path");
    expect(input.filename).to.equals("receipt.jpg");
    expect(input.fileExtension).to.equals("image/jpg");
    expect(input.fileObject).to.eqls(expectedResult);
  });

  it("should accept read streams", async () => {
    const stream = fs.createReadStream(
      path.join(__dirname, "data/receipt/receipt.jpg")
    );
    const input = new Input({ file: stream, inputType: "stream" });
    await input.init();
    expect(input.inputType).to.equals("base64");
    expect(input.filename).to.equals("from_base64.jpg");
    expect(input.fileExtension).to.equals("image/jpeg");
    //expect(input.fileObject).to.eqls(stream);
  });

  it("should create a dummy file", async () => {
    const input = new Input({ inputType: "dummy" });
    await input.init();
    expect(input.inputType).to.equals("dummy");
    expect(input.filename).to.equals("");
  });

  it("should cut a PDF", async () => {
    const input = new Input({
      file: path.join(__dirname, "data/invoice/invoice_10p.pdf"),
      inputType: "path",
    });
    await input.init();
    expect(input.inputType).to.equals("path");
    expect(input.filename).to.equals("invoice_10p.pdf");
    expect(input.fileExtension).to.equals("application/pdf");
    expect(await input.countPages()).to.equals(3);
  });

  it("should not cut a PDF", async () => {
    const input = new Input({
      file: path.join(__dirname, "data/invoice/invoice.pdf"),
      inputType: "path",
    });
    await input.init();
    const expectedResult = await fs.promises.readFile(
      path.join(__dirname, "data/invoice/invoice.pdf")
    );
    expect(input.inputType).to.equals("path");
    expect(input.filename).to.equals("invoice.pdf");
    expect(input.fileExtension).to.equals("application/pdf");
    expect(input.fileObject).to.eql(expectedResult);
  });
});
