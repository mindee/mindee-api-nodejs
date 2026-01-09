import { Readable } from "stream";
import { LocalInputSource } from "./localInputSource.js";
import { INPUT_TYPE_STREAM } from "./inputSource.js";
import { logger } from "@/logger.js";

interface StreamInputProps {
  inputStream: Readable;
  filename: string;
}

export class StreamInput extends LocalInputSource {
  private readonly inputStream: Readable;
  fileObject: Buffer = Buffer.alloc(0);

  constructor({ inputStream, filename }: StreamInputProps) {
    super({
      inputType: INPUT_TYPE_STREAM,
    });
    this.filename = filename;
    this.inputStream = inputStream;
  }

  async init() {
    if (this.initialized) {
      return;
    }
    logger.debug("Loading from stream");
    this.fileObject = await this.stream2buffer(this.inputStream);
    this.mimeType = await this.checkMimetype();
    this.initialized = true;
  }

  async stream2buffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const _buf = Array<any>();
      stream.on("data", (chunk) => _buf.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(_buf)));
      stream.on("error", (err) => reject(`Error converting stream - ${err}`));
    });
  }
}
