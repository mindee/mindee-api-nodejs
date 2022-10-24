import { promises as fs, ReadStream } from "fs";
import * as path from "path";
import * as fileType from "file-type";

import { errorHandler } from "../errors/handler";
import { Buffer } from "node:buffer";
import { logger } from "../logger";
import { PageOptions } from "./PageOptions";
import { cutPdf } from "../pdf";

interface InputProps {
  inputType: string;
}

export const INPUT_TYPE_STREAM = "stream";
export const INPUT_TYPE_BASE64 = "base64";
export const INPUT_TYPE_BYTES = "bytes";
export const INPUT_TYPE_PATH = "path";

const MIMETYPES = new Map<string, string>([
  [".pdf", "application/pdf"],
  [".heic", "image/heic"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".tif", "image/tiff"],
  [".tiff", "image/tiff"],
  [".webp", "image/webp"],
]);
const ALLOWED_INPUT_TYPES = [
  INPUT_TYPE_STREAM,
  INPUT_TYPE_BASE64,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_PATH,
];

export class Input {
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
    logger.debug(`Loading file from: ${inputType}`);
  }

  async init() {
    throw new Error("not Implemented");
  }

  isPdf(): boolean {
    return this.mimeType === "application/pdf";
  }

  async checkMimetype(): Promise<string> {
    let mimeType: string;
    const fileExt = path.extname(this.filename);
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
    logger.debug(`File is of type: ${mimeType}`);
    return mimeType;
  }

  /** Merge PDF pages */
  async cutPdf(pageOptions: PageOptions) {
    const splittedPdf = await cutPdf(this.fileObject, pageOptions);
    this.fileObject = Buffer.from(splittedPdf.file);
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
    logger.debug(`Loading from: ${this.inputPath}`);
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
