import { Buffer } from "node:buffer";
import { MindeeError } from "../errors";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { logger } from "../logger";
import { BufferInput } from "../input";


export abstract class ExtractedImage {
  protected imageData: Buffer;
  protected internalFileName: string;


  constructor(imageData: Uint8Array, fileName: string) {
    this.imageData = Buffer.from(imageData);
    this.internalFileName = fileName;
  }

  /**
   * Saves the document to a file.
   * @param fileName Name of the file to save.
   * @param inputPath Location of the saved file. Defaults to './tmp'
   */
  saveToFile(fileName: string, inputPath: string = "./tmp") {
    try {
      writeFileSync(path.resolve(inputPath, fileName), this.imageData);
      logger.info(`File saved successfully to ${path.resolve(inputPath, fileName)}.`);
    } catch (e) {
      if (e instanceof TypeError) {
        throw new MindeeError("Invalid path/filename provided.");
      } else {
        throw e;
      }
    }
  }
  asSource(): BufferInput {
    return new BufferInput({
      buffer: this.imageData,
      filename: this.internalFileName,
    });
  }
}
