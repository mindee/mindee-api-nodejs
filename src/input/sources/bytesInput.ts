import { INPUT_TYPE_BYTES } from "./inputSource";
import { LocalInputSource } from "./localInputSource";

interface BytesInputProps {
  inputBytes: Uint8Array;
  filename: string;
}

export class BytesInput extends LocalInputSource {
  private inputBytes: Uint8Array;
  fileObject: Buffer = Buffer.alloc(0);

  constructor({ inputBytes, filename }: BytesInputProps) {
    super({
      inputType: INPUT_TYPE_BYTES,
    });
    this.filename = filename;
    this.inputBytes = inputBytes;
  }

  async init() {
    this.fileObject = Buffer.from(this.inputBytes);
    this.mimeType = await this.checkMimetype();
    this.inputBytes = new Uint8Array(0);
  }
}
