import { Buffer } from "node:buffer";
import { MindeeError } from "../../errors";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { logger } from "../../logger";
import { BufferInput } from "../../input";


export abstract class ExtractedImage {
  public buffer: Buffer;
  protected internalFileName: string;


  protected constructor(buffer: Uint8Array, fileName: string) {
    this.buffer = Buffer.from(buffer);
    this.internalFileName = fileName;
  }

  /**
   * Saves the document to a file.
   *
   * @param outputPath Path to save the file to.
   */
  saveToFile(outputPath: string) {
    try {
      writeFileSync(path.resolve(outputPath), this.buffer);
      logger.info(`File saved successfully to ${path.resolve(outputPath)}.`);
    } catch (e) {
      if (e instanceof TypeError) {
        throw new MindeeError("Invalid path/filename provided.");
      } else {
        throw e;
      }
    }
  }


  /**
   * Return the file as a Mindee-compatible BufferInput source.
   *
   * @returns A BufferInput source.
   */
  asSource(): BufferInput {
    return new BufferInput({
      buffer: this.buffer,
      filename: this.internalFileName,
    });
  }
}
