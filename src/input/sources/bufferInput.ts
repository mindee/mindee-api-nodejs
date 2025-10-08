import { LocalInputSource } from "./localInputSource";
import { INPUT_TYPE_BUFFER } from "./inputSource";
import { logger } from "../../logger";

interface BufferInputProps {
  buffer: Buffer;
  filename: string;
}

export class BufferInput extends LocalInputSource {
  constructor({ buffer, filename }: BufferInputProps) {
    super({
      inputType: INPUT_TYPE_BUFFER,
    });
    this.fileObject = buffer;
    this.filename = filename;
  }

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }
    logger.debug("Loading from buffer");
    this.mimeType = await this.checkMimetype();
    this.initialized = true;
  }
}
