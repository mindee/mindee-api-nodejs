import { Base64Input, BufferInput, BytesInput, PathInput, StreamInput, UrlInput } from "./input";
import { Readable } from "stream";


export abstract class BaseClient {
  /**
   * Load an input document from a local path.
   * @param inputPath
   */
  docFromPath(inputPath: string): PathInput {
    return new PathInput({
      inputPath: inputPath,
    });
  }

  /**
   * Load an input document from a base64 encoded string.
   * @param inputString input content, as a string.
   * @param filename file name.
   */
  docFromBase64(inputString: string, filename: string): Base64Input {
    return new Base64Input({
      inputString: inputString,
      filename: filename,
    });
  }

  /**
   * Load an input document from a `stream.Readable` object.
   * @param inputStream input content, as a readable stream.
   * @param filename file name.
   */
  docFromStream(inputStream: Readable, filename: string): StreamInput {
    return new StreamInput({
      inputStream: inputStream,
      filename: filename,
    });
  }

  /**
   * Load an input document from bytes.
   * @param inputBytes input content, as a Uint8Array or Buffer.
   * @param filename file name.
   */
  docFromBytes(inputBytes: Uint8Array, filename: string): BytesInput {
    return new BytesInput({
      inputBytes: inputBytes,
      filename: filename,
    });
  }

  /**
   * Load an input document from a URL.
   * @param url input url. Must be HTTPS.
   */
  docFromUrl(url: string): UrlInput {
    return new UrlInput({
      url: url,
    });
  }

  /**
   * Load an input document from a Buffer.
   * @param buffer input content, as a buffer.
   * @param filename file name.
   */
  docFromBuffer(buffer: Buffer, filename: string): BufferInput {
    return new BufferInput({
      buffer: buffer,
      filename: filename,
    });
  }
}
