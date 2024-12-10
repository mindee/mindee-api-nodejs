import { INPUT_TYPE_BYTES } from "./inputSource";
import { LocalInputSource } from "./localInputSource";

interface BytesInputProps {
  inputBytes: string;
  filename: string;
}

export class BytesInput extends LocalInputSource {
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
