import path from "node:path";
import { BufferInput, MIMETYPES } from "@/input/index.js";
import { MindeeError } from "@/errors/index.js";
import { Buffer } from "node:buffer";
import { writeFile } from "fs/promises";
import { logger } from "@/logger.js";
import { writeFileSync } from "node:fs";

export class ExtractedPdf {
  public readonly buffer: Buffer;
  public readonly filename: string;
  public readonly pageCount: number;
  public readonly pageIndexes: number[];

  constructor(pdfData: Buffer<ArrayBufferLike>, filename: string, pageIndexes: number[]) {
    this.buffer = pdfData;
    this.filename = filename;
    this.pageCount = pageIndexes.length;
    this.pageIndexes = pageIndexes;
  }

  /**
   * Saves the document to a file.
   *
   * @param outputPath Path to save the file to.
   */
  async saveToFileAsync(outputPath: string) {
    const fileExt = path.extname(outputPath).toLowerCase();
    if (fileExt !== ".pdf" && !MIMETYPES.has(fileExt)) {
      outputPath += ".pdf";
    }

    try {
      await writeFile(path.resolve(outputPath), this.buffer);
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
   * Saves the document to a file synchronously.
   * @param outputPath
   */
  saveToFile(outputPath: string){
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
  asInputSource(): BufferInput {
    return new BufferInput({
      buffer: this.buffer,
      filename: this.filename,
    });
  }
}
