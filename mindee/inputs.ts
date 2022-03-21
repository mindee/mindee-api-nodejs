import fs from "fs/promises";
import * as path from "path";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as concat from "concat-stream";
import { Base64Encode } from "base64-stream";
import * as fileType from "file-type";
import * as ArrayBufferEncode from "base64-arraybuffer";

import { errorHandler } from "@errors/handler";
import { PDFDocument } from "pdf-lib";

interface InputProps {
  inputType: string;
  file?: Buffer | string;
  cutPages?: boolean;
  filename: string;
}

export class Input {
  MIMETYPES = new Map<string, string>([
    ["pdf", "application/pdf"],
    ["heic", "image/heic"],
    ["jpg", "image/jpeg"],
    ["jpeg", "image/jpeg"],
    ["png", "image/png"],
    ["tif", "image/tiff"],
    ["tiff", "image/tiff"],
    ["webp", "image/webp"],
  ]);
  ALLOWED_INPUT_TYPE = ["base64", "path", "stream", "dummy"];
  MAX_DOC_PAGES = 3;
  public file;
  public inputType;
  public cutPages;
  public filename: string;
  public fileObject?: Buffer | string;
  public filepath?: Buffer | string;
  public fileExtension?: string;

  /**
   * @param {(String | Buffer)} file - the file that will be read. Either path or base64 string, or a steam
   * @param {String} inputType - the type of input used in file ("base64", "path", "dummy").
   *                             NB: dummy is only used for tests purposes
   * @param {String} filename - File name of the input
   * @param cutPages
   * NB: Because of async calls, init() should be called after creating the object
   */
  constructor({ file, inputType, cutPages = true, filename }: InputProps) {
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
    this.cutPages = cutPages;
  }

  async init() {
    if (this.inputType === "base64") await this.doc_from_base64();
    else if (this.inputType === "path") await this.doc_from_path();
    else if (this.inputType === "stream") await this.doc_from_file();
    else this.initDummy();

    if (this.fileExtension === "application/pdf" && this.cutPages) {
      await this.cutPdf();
    }
  }

  async guessMimetype(): Promise<string> {
    let mimeType: string;
    const fileExt = this.filename.split(".").pop();
    if (fileExt) {
      mimeType = this.MIMETYPES.get(fileExt) || "";
    } else {
      const guess = await fileType.fromBuffer(
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        Buffer.from(this.fileObject, "base64")
      );
      if (guess !== undefined) {
        mimeType = guess.mime;
      } else {
        throw "Could not determine the MIME type of the file";
      }
    }
    if ((this.MIMETYPES.get(mimeType))) {
      errorHandler.throw(
          new Error(
              `File type is not allowed. It must be one of ${this.MIMETYPES.keys()}`
          )
      );
    }
    return mimeType;
  }

  async doc_from_base64() {
    this.fileObject = this.file;
    this.filepath = undefined;
    this.fileExtension = await this.guessMimetype();
  }

  async doc_from_path() {
    this.fileObject = await fs.readFile(this.file as string);
    this.filepath = this.file;
    if (typeof this.file === "string") {
      this.filename = this.filename || path.basename(this.file);
    }
    this.fileExtension = await this.guessMimetype();
  }

  async doc_from_file() {
    this.file = await this.streamToBase64(this.file);
    this.inputType = "base64";
    await this.doc_from_base64();
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
  async streamToBase64(stream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const base64 = new Base64Encode();

      const cbConcat = (base64: Base64Encode) => {
        // @ts-ignore TO DO : FIX
        resolve(base64);
      };

      stream
        .pipe(base64)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore TO DO : FIX
        .pipe(concat(cbConcat))
        .on("error", (error: any) => {
          reject(error);
        });
    });
  }

  async countPages() {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | Buffer | undefined'
    let pdfDocument = await PDFDocument.load(this.fileObject, {
      ignoreEncryption: true,
    });
    return pdfDocument.getPageCount();
  }

  /** Merge PDF pages */
  async cutPdf() {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | Buffer | undefined'
    let currentPdf = await PDFDocument.load(this.fileObject, {
      ignoreEncryption: true,
    });

    const pdfLength = currentPdf.getPageCount();
    if (pdfLength <= this.MAX_DOC_PAGES) {
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
