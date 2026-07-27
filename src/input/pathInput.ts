import { INPUT_TYPE_PATH } from "./inputSource.js";
import { LocalInputSource } from "./localInputSource.js";
import path from "path";
import { logger } from "@/logger.js";
import { promises as fs } from "fs";

interface PathInputProps {
  inputPath: string;
}

/** Local input source that reads a file from disk by path. */
export class PathInput extends LocalInputSource {
  /** Path used to read the local file. */
  readonly inputPath: string;
  /** File content loaded from disk. */
  fileObject: Buffer = Buffer.alloc(0);

  constructor({ inputPath }: PathInputProps) {
    super({
      inputType: INPUT_TYPE_PATH,
    });
    this.inputPath = inputPath;
    this.filename = path.basename(this.inputPath);
  }

  /** Reads the file from disk and validates MIME type. */
  async init() {
    if (this.initialized) {
      return;
    }
    logger.debug(`Loading from path: ${this.inputPath}`);
    this.fileObject = Buffer.from(await fs.readFile(this.inputPath));
    this.mimeType = await this.checkMimetype();
    this.initialized = true;
  }
}
