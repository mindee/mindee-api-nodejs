const fs = require("fs").promises;
const errorHandler = require("./errors/handler");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const concat = require("concat-stream");
const { Base64Encode } = require("base64-stream");
const fileType = require("file-type");
const ArrayBufferEncode = require("base64-arraybuffer");
const { logger } = require("./logger");

class Input {
  MIMETYPES = {
    pdf: "application/pdf",
    heic: "image/heic",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    tif: "image/tiff",
    tiff: "image/tiff",
    webp: "image/webp",
  };
  ALLOWED_INPUT_TYPE = ["base64", "path", "stream", "dummy"];
  MAX_DOC_PAGES = 3;

  /**
   * @param {(String | Buffer)} file - the file that will be read. Either path or base64 string, or a steam
   * @param {String} inputType - the type of input used in file ("base64", "path", "dummy").
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
    if (this.inputType === "base64") await this.initBase64();
    else if (this.inputType === "path") await this.initFile();
    else if (this.inputType === "stream") await this.initStream();
    else this.initDummy();

    if (this.fileExtension === "application/pdf" && this.allowCutPdf === true) {
      await this.cutPdf();
    }
  }

  async initBase64() {
    this.fileObject = this.file;
    this.filepath = undefined;

    if (this.filename === undefined) {
      const mimeType = await fileType.fromBuffer(
        Buffer.from(this.fileObject, "base64")
      );
      if (mimeType !== undefined) {
        this.fileExtension = mimeType.mime;
        this.filename = `from_${this.inputType}.${mimeType.ext}`;
      } else {
        throw "Could not determine the MIME type. Please specify the 'filename' option.";
      }
    } else {
      const filetype = this.filename.split(".").pop();
      this.fileExtension = this.MIMETYPES[filetype];
    }
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
  }

  async initStream() {
    const file = await this.streamToBase64(this.file);

    this.file = file;
    this.inputType = "base64";
    await this.initBase64();
  }

  initDummy() {
    this.fileObject = "";
    this.filename = "";
    this.filepath = "";
    this.fileExtension = "";
  }

  /**
   * Convert ReadableStream to Base64 encoded String
   *
   * @param {*} stream ReadableStream to encode
   * @returns Base64 encoded String
   */
  async streamToBase64(stream) {
    return new Promise((resolve, reject) => {
      const base64 = new Base64Encode();

      const cbConcat = (base64) => {
        resolve(base64);
      };

      stream
        .pipe(base64)
        .pipe(concat(cbConcat))
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  async countPages() {
    let pdfDocument = await PDFDocument.load(this.fileObject, {
      ignoreEncryption: true,
    });
    return pdfDocument.getPageCount();
  }

  /** Merge PDF pages */
  async cutPdf() {
    let currentPdf = await PDFDocument.load(this.fileObject, {
      ignoreEncryption: true,
    });

    const pdfLength = currentPdf.getPageCount();
    if (pdfLength <= this.MAX_DOC_PAGES) {
      return;
    }

    if (currentPdf.isEncrypted) {
      logger.error(
        "PDF of %d pages is encrypted, not possible to cut pages.",
        pdfLength
      );
      return;
    }

    const newPdf = await PDFDocument.create();
    const pagesNumbers = [0, pdfLength - 2, pdfLength - 1].slice(
      0,
      this.MAX_DOC_PAGES
    );

    const pages = await newPdf.copyPages(currentPdf, pagesNumbers);
    pages.forEach((page) => newPdf.addPage(page));
    const data = await newPdf.save();

    if (this.inputType === "path") {
      this.fileObject = Buffer.from(data);
    } else if (this.inputType === "base64") {
      this.fileObject = ArrayBufferEncode.encode(data);
    }
  }
}

module.exports = Input;
