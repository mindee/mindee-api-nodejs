import { LocalInputSource } from "./localInputSource.js";
import { INPUT_TYPE_BASE64 } from "./inputSource.js";
import { logger } from "@/logger.js";

interface Base64InputProps {
  inputString: string;
  filename: string;
}

/** Local input source backed by a base64-encoded payload. */
export class Base64Input extends LocalInputSource {
  private inputString: string;
  /** Decoded binary payload built from the base64 input. */
  fileObject: Buffer = Buffer.alloc(0);

  constructor({ inputString, filename }: Base64InputProps) {
    super({
      inputType: INPUT_TYPE_BASE64,
    });
    this.filename = filename;
    this.inputString = inputString;
  }

  /** Decodes and validates the provided base64 content. */
  async init() {
    if (this.initialized) {
      return;
    }
    logger.debug("Loading from base64");
    this.fileObject = Buffer.from(this.inputString, "base64");
    this.mimeType = await this.checkMimetype();
    // clear out the string
    this.inputString = "";
    this.initialized = true;
  }
}
