import { LocalInputSource } from "./localInputSource";
import { INPUT_TYPE_BASE64 } from "./inputSource";

interface Base64InputProps {
  inputString: string;
  filename: string;
}

export class Base64Input extends LocalInputSource {
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
