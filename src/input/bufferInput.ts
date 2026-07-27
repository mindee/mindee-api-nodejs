import { LocalInputSource } from "./localInputSource.js";
import { INPUT_TYPE_BUFFER } from "./inputSource.js";
import { logger } from "@/logger.js";

interface BufferInputProps {
  buffer: Buffer;
  filename: string;
}

/** Local input source backed by an in-memory `Buffer`. */
export class BufferInput extends LocalInputSource {
  constructor({ buffer, filename }: BufferInputProps) {
    super({
      inputType: INPUT_TYPE_BUFFER,
    });
    this.fileObject = buffer;
    this.filename = filename;
  }

  /** Validates and initializes the in-memory buffer input. */
  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }
    logger.debug("Loading from buffer");
    this.mimeType = await this.checkMimetype();
    this.initialized = true;
  }
}
