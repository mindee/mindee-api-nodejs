import { Buffer } from "node:buffer";
import { MindeeError } from "@/errors/index.js";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { logger } from "@/logger.js";
import { BufferInput, MIMETYPES } from "@/input/index.js";
import type * as popplerTypes from "node-poppler";
import { writeFile } from "fs/promises";
import { loadOptionalDependency } from "@/dependency/index.js";

/**
 * Generic class for image extraction
 */
export class ExtractedImage {
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
  async saveToFileAsync(outputPath: string) {
    const fileExt = path.extname(outputPath).toLowerCase();
    if (!MIMETYPES.has(fileExt)) {
      throw new MindeeError(`Unsupported file extension: ${fileExt}`);
    }

    try {
      let outputBuffer: Buffer = this.buffer;
      if (fileExt !== ".pdf") {
        const popplerImport = await loadOptionalDependency<typeof popplerTypes>("node-poppler", "Image Processing");
        const poppler = (popplerImport as any).default || popplerImport;
        const popplerInstance = new poppler.Poppler();
        const options: Record<string, unknown> = {
          firstPageToConvert: 1,
          lastPageToConvert: 1,
          singleFile: true,
        };

        if (fileExt === ".png") {
          options.pngFile = true;
        } else if (fileExt === ".jpg" || fileExt === ".jpeg") {
          options.jpegFile = true;
        } else if (fileExt === ".tiff" || fileExt === ".tif") {
          options.tiffFile = true;
        }

        const result = await popplerInstance.pdfToCairo(this.buffer, undefined, options);
        outputBuffer = Buffer.from(result, "latin1");
      }

      await writeFile(path.resolve(outputPath), outputBuffer);
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
   * Attempts to saves the document to a file synchronously.
   * Throws an error if the file extension is not supported or if the file could not be saved to disk for some reason.
   *
   * @param outputPath Path to save the file to.
   */
  saveToFile(outputPath: string) {
    const fileExt = path.extname(outputPath).toLowerCase();
    if (fileExt !== ".pdf") {
      throw new MindeeError(
        `Unsupported file extension: ${fileExt}. For image formats, use saveToFileAsync() instead.`
      );
    } else {
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
