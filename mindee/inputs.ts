import { promises as fs, ReadStream } from "fs";
import * as path from "path";
import * as fileType from "file-type";

import { errorHandler } from "./errors/handler";
import { PDFDocument } from "pdf-lib";
import { Buffer } from "node:buffer";

interface InputProps {
  inputType: string;
}

const INPUT_TYPE_STREAM = "stream";
const INPUT_TYPE_BASE64 = "base64";
const INPUT_TYPE_BYTES = "bytes";
const INPUT_TYPE_PATH = "path";

const MIMETYPES = new Map<string, string>([
  ["pdf", "application/pdf"],
  ["heic", "image/heic"],
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["tif", "image/tiff"],
  ["tiff", "image/tiff"],
  ["webp", "image/webp"],
]);
const ALLOWED_INPUT_TYPES = [
  INPUT_TYPE_STREAM,
  INPUT_TYPE_BASE64,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_PATH,
];

export class Input {
  MAX_DOC_PAGES = 3;
  public inputType: string;
  public filename: string = "";
  public filepath?: string;
  public mimeType: string = "";
  public fileObject: Buffer = Buffer.alloc(0);

  /**
   * @param {String} inputType - the type of input used in file ("base64", "path", "dummy").
   *                             NB: dummy is only used for tests purposes
   * @param {Boolean} cutPages
   * NB: Because of async calls, init() should be called after creating the object
   */
  constructor({ inputType }: InputProps) {
    // Check if inputType is valid
    if (!ALLOWED_INPUT_TYPES.includes(inputType)) {
      const allowed = Array.from(MIMETYPES.keys()).join(", ");
      errorHandler.throw(
        new Error(`Invalid input type, must be one of ${allowed}.`)
      );
    }
    this.inputType = inputType;
  }

  async init() {
    throw new Error("not Implemented");
  }

  isPdf(): boolean {
    return this.mimeType === "application/pdf";
  }

  async checkMimetype(): Promise<string> {
    let mimeType: string;
    const fileExt = this.filename.split(".").pop();
    if (fileExt) {
      mimeType = MIMETYPES.get(fileExt.toLowerCase()) || "";
    } else {
      const guess = await fileType.fromBuffer(this.fileObject);
      if (guess !== undefined) {
        mimeType = guess.mime;
      } else {
        throw "Could not determine the MIME type of the file";
      }
    }
    if (!mimeType) {
      const allowed = Array.from(MIMETYPES.keys()).join(", ");
      const err = new Error(`Invalid file type, must be one of ${allowed}.`);
      errorHandler.throw(err);
    }
    return mimeType;
  }

  async countPages() {
    const pdfDocument = await PDFDocument.load(this.fileObject, {
      ignoreEncryption: true,
    });
    return pdfDocument.getPageCount();
  }

  /** Merge PDF pages */
  async cutPdf() {
    const currentPdf = await PDFDocument.load(this.fileObject, {
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

    this.fileObject = Buffer.from(data);
  }
}

//
// Path
//

interface PathInputProps {
  inputPath: string;
}

export class PathInput extends Input {
  readonly inputPath: string;

  constructor({ inputPath }: PathInputProps) {
    super({
      inputType: INPUT_TYPE_PATH,
    });
    this.inputPath = inputPath;
    this.filename = path.basename(this.inputPath);
  }

  async init() {
    this.fileObject = Buffer.from(await fs.readFile(this.inputPath));
    this.mimeType = await this.checkMimetype();
  }
}

//
// Base 64
//

interface Base64InputProps {
  inputString: string;
  filename: string;
}

export class Base64Input extends Input {
  private inputString: string;

  constructor({ inputString, filename }: Base64InputProps) {
    super({
      inputType: INPUT_TYPE_BASE64,
    });
    this.filename = filename;
    this.inputString = inputString;
  }

  async init() {
    this.fileObject = Buffer.from(this.inputString, "base64");
    this.mimeType = await this.checkMimetype();
    // clear out the string
    this.inputString = "";
  }
}

//
// Stream
//

interface StreamInputProps {
  inputStream: ReadStream;
  filename: string;
}

export class StreamInput extends Input {
  private inputStream: ReadStream;

  constructor({ inputStream, filename }: StreamInputProps) {
    super({
      inputType: INPUT_TYPE_STREAM,
    });
    this.filename = filename;
    this.inputStream = inputStream;
  }

  async init() {
    this.fileObject = await this.stream2buffer(this.inputStream);
    this.mimeType = await this.checkMimetype();
  }

  async stream2buffer(stream: ReadStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const _buf = Array<any>();
      stream.on("data", (chunk) => _buf.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(_buf)));
      stream.on("error", (err) => reject(`Error converting stream - ${err}`));
    });
  }
}

//
// Bytes
//

interface BytesInputProps {
  inputBytes: string;
  filename: string;
}

export class BytesInput extends Input {
  private inputBytes: string;

  constructor({ inputBytes, filename }: BytesInputProps) {
    super({
      inputType: INPUT_TYPE_BYTES,
    });
    this.filename = filename;
    this.inputBytes = inputBytes;
  }

  async init() {
    this.fileObject = Buffer.from(this.inputBytes, "hex");
    this.mimeType = await this.checkMimetype();
    // clear out the string
    this.inputBytes = "";
  }
}
