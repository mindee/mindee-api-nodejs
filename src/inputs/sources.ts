import { promises as fs, ReadStream } from "fs";
import * as path from "path";

import { errorHandler } from "../errors/handler";
import { Buffer } from "node:buffer";
import { logger } from "../logger";
import {
  INPUT_TYPE_PATH,
  INPUT_TYPE_STREAM,
  INPUT_TYPE_BASE64,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_URL,
  INPUT_TYPE_BUFFER,
  InputSource,
} from "./base";

//
// Path
//

interface PathInputProps {
  inputPath: string;
}

export class PathInput extends InputSource {
  readonly inputPath: string;
  fileObject: Buffer = Buffer.alloc(0);

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

export class Base64Input extends InputSource {
  private inputString: string;
  fileObject: Buffer = Buffer.alloc(0);

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

export class StreamInput extends InputSource {
  private readonly inputStream: ReadStream;
  fileObject: Buffer = Buffer.alloc(0);

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

export class BytesInput extends InputSource {
  private inputBytes: string;
  fileObject: Buffer = Buffer.alloc(0);

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

//
// URL
//

interface UrlInputProps {
  url: string;
}

export class UrlInput extends InputSource {
  private readonly url: string;
  fileObject!: string;

  constructor({ url }: UrlInputProps) {
    super({
      inputType: INPUT_TYPE_URL,
    });
    this.url = url;
  }

  async init() {
    if (!this.url.toLowerCase().startsWith("https")) {
      errorHandler.throw(new Error("URL must be HTTPS"));
    }
    this.fileObject = this.url;
  }
}

//
// Buffer
//

interface BufferInputProps {
  buffer: Buffer;
  filename: string;
}

export class BufferInput extends InputSource {
  constructor({ buffer, filename }: BufferInputProps) {
    super({
      inputType: INPUT_TYPE_BUFFER,
    });
    this.fileObject = buffer;
    this.filename = filename;
  }

  async init(): Promise<void> {
    this.mimeType = await this.checkMimetype();
  }
}
