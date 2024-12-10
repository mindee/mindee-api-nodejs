import { INPUT_TYPE_PATH } from "./inputSource";
import { LocalInputSource } from "./localInputSource";
import path from "path";
import { logger } from "../../logger";
import { promises as fs } from "fs";

interface PathInputProps {
  inputPath: string;
}

export class PathInput extends LocalInputSource {
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
