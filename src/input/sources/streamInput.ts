import { Readable } from "stream";
import { LocalInputSource } from "./localInputSource";
import { INPUT_TYPE_STREAM } from "./inputSource";
import { logger } from "../../logger";
import { MindeeInputError } from "../../errors/mindeeError";

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

  async init(signal? : AbortSignal) {
    if (this.initialized) {
      return;
    }
    logger.debug("Loading from stream");
    this.fileObject = await this.stream2buffer(this.inputStream, signal);
    this.mimeType = await this.checkMimetype();
    this.initialized = true;
  }

  async stream2buffer(stream: Readable, signal?: AbortSignal): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      if (stream.closed || stream.destroyed) {
        return reject(new MindeeInputError("Stream is already closed"));
      }
      if (signal?.aborted) {
        return reject(new MindeeInputError("Operation aborted"));
      }

      const onAbort = () => {
        stream.destroy();
        reject(new MindeeInputError("Operation aborted"));
      };

      if (signal) {
        signal.addEventListener("abort", onAbort, { once: true });
      }


      const cleanup = () => {
        signal?.removeEventListener("abort", onAbort);
      };

      const _buf: Buffer[] = [];
      stream.pause();
      stream.on("data", (chunk) => _buf.push(chunk));
      stream.on("end", () => {
        cleanup();
        resolve(Buffer.concat(_buf));
      });
      stream.on("error", (err) => {
        cleanup();
        reject(new MindeeInputError(`Error converting stream - ${err}`));
      });
      stream.resume();
    });
  }
}
