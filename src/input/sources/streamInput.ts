import { Readable } from "stream";
import { LocalInputSource } from "./localInputSource";
import { INPUT_TYPE_STREAM } from "./inputSource";
import { logger } from "../../logger";
import { MindeeError } from "../../errors";

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
      if (stream.closed || stream.destroyed) {
        return reject(new MindeeError("Stream is already closed"));
      }

      const _buf: Buffer[] = [];
      stream.pause();
      stream.on("data", (chunk) => _buf.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(_buf)));
      stream.on("error", (err) => reject(new Error(`Error converting stream - ${err}`)));
      stream.resume();
    });
  }
}
