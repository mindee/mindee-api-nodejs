const fs = require("fs").promises;
const errorHandler = require("./errors/handler");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

class Input {
  MIMETYPES = {
    png: "image/png",
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    pdf: "application/pdf",
  };
  ALLOWED_INPUT_TYPE = ["base64", "path", "stream", "dummy"];
  CUT_PDF_SIZE = 5;

  /**
   * @param {(String | Buffer)} file - the file that will be read. Either path or base64 string, or a steam
   * @param {String} inputType - the type of input used in file ("base64", "path", "dummy").
   *                             NB: in case of base64 file, only jpeg file is supported
   *                             NB: dummy is only used for tests purposes
   * @param {String} filename - File name of the input
   * @param {Boolean} cut_pdf: Automatically reconstruct pdf with more than 4 pages
   * NB: Because of async calls, init() should be called after creating the object
   */
  constructor({ file, filename = undefined, inputType, allowCutPdf = true }) {
    // Check if inputType is valid
    if (!this.ALLOWED_INPUT_TYPE.includes(inputType)) {
      errorHandler.throw(
        new Error(
          `The input type is invalid. It should be \
            ${this.ALLOWED_INPUT_TYPE.toString()}`
        )
      );
    }
    this.file = file;
    this.filename = filename;
    this.inputType = inputType;
    this.allowCutPdf = allowCutPdf;
  }

  async init() {
    if (this.inputType === "base64") this.initBase64();
    else if (this.inputType === "path") await this.initFile();
    else if (this.inputType === "stream") await this.initStream();
    else this.initDummy();
  }

  initBase64() {
    this.fileObject = this.file;
    this.filepath = undefined;
    this.fileExtension = undefined;
  }

  async initFile() {
    this.fileObject = await fs.readFile(this.file);
    this.filepath = this.file;
    this.filename = this.filename || path.basename(this.file);
    // Check if file type is valid
    const filetype = this.filename.split(".").pop();
    if (!(filetype in this.MIMETYPES)) {
      errorHandler.throw(
        new Error(
          `File type is not allowed. It must be ${Object.keys(
            this.MIMETYPES
          ).toString()}`
        )
      );
    }
    this.fileExtension = this.MIMETYPES[filetype];

    if (this.fileExtension === "application/pdf" && this.allowCutPdf == true) {
      await this.cutPdf();
    }
  }

  async initStream() {
    this.fileObject = this.file;
    this.filename = this.filename || "stream";
    this.filepath = undefined;
  }

  initDummy() {
    this.fileObject = "";
    this.filename = "";
    this.filepath = "";
    this.fileExtension = "";
  }

  /** Cut PDF if pages > 5 */
  async cutPdf() {
    // convert document to PDFDocument & cut CUT_PDF_SIZE - 1 first pages and last page
    const pdfDocument = await PDFDocument.load(this.fileObject);
    const splitedPdfDocument = await PDFDocument.create();
    const pdfLength = pdfDocument.getPageCount();
    if (pdfLength <= this.CUT_PDF_SIZE) return;
    const pagesNumbers = [
      ...Array(this.CUT_PDF_SIZE - 1).keys(),
      pdfLength - 1,
    ];
    const pages = await splitedPdfDocument.copyPages(pdfDocument, pagesNumbers);
    pages.forEach((page) => splitedPdfDocument.addPage(page));
    const data = await splitedPdfDocument.save();
    this.fileObject = Buffer.from(data);
  }
}

module.exports = Input;
