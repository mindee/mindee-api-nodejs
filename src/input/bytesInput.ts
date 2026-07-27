import { INPUT_TYPE_BYTES } from "./inputSource.js";
import { LocalInputSource } from "./localInputSource.js";
import { logger } from "@/logger.js";

interface BytesInputProps {
  inputBytes: Uint8Array;
  filename: string;
}

/** Local input source backed by a `Uint8Array`. */
export class BytesInput extends LocalInputSource {
  private inputBytes: Uint8Array;
  /** Binary payload built from the byte array. */
  fileObject: Buffer = Buffer.alloc(0);

  constructor({ inputBytes, filename }: BytesInputProps) {
    super({
      inputType: INPUT_TYPE_BYTES,
    });
    this.filename = filename;
    this.inputBytes = inputBytes;
  }

  /** Converts bytes to a buffer and validates MIME type. */
  async init() {
    if (this.initialized) {
      return;
    }
    logger.debug("Loading from bytes");
    this.fileObject = Buffer.from(this.inputBytes);
    this.mimeType = await this.checkMimetype();
    this.inputBytes = new Uint8Array(0);
    this.initialized = true;
  }
}
