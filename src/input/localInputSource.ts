import path from "path";
import { MindeeInputSourceError } from "@/errors/index.js";
import { errorHandler } from "@/errors/handler.js";
import { logger } from "@/logger.js";
import { compressImage } from "@/image/index.js";
import { compressPdf, countPages, extractPages, hasSourceText } from "@/pdf/index.js";
import { fileTypeFromBuffer } from "file-type";
import { PageOptions } from "../input/pageOptions.js";
import {
  InputSource,
  InputConstructor,
  INPUT_TYPE_STREAM,
  INPUT_TYPE_BASE64,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_PATH, INPUT_TYPE_BUFFER
} from "./inputSource.js";

export const MIMETYPES = new Map<string, string>([
  [".pdf", "application/pdf"],
  [".heic", "image/heic"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".tif", "image/tiff"],
  [".tiff", "image/tiff"],
  [".webp", "image/webp"],
]);

const ALLOWED_INPUT_TYPES = [
  INPUT_TYPE_STREAM,
  INPUT_TYPE_BASE64,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_PATH,
  INPUT_TYPE_BUFFER,
];

export abstract class LocalInputSource extends InputSource {
  public inputType: string;
  public filename: string = "";
  public filepath?: string;
  public mimeType: string = "";
  public fileObject!: Buffer | string;

  /**
   * @param {InputConstructor} constructor Constructor parameters.
   */
  protected constructor({ inputType }: InputConstructor) {
    super();
    // Check if inputType is valid
    if (!ALLOWED_INPUT_TYPES.includes(inputType)) {
      const allowed = Array.from(ALLOWED_INPUT_TYPES.keys()).join(", ");
      errorHandler.throw(
        new MindeeInputSourceError(`Invalid input type, must be one of ${allowed}.`)
      );
    }
    this.inputType = inputType;
    logger.debug(`Initialized local input source of type: ${inputType}`);
  }

  protected async checkMimetype(): Promise<string> {
    if (!(this.fileObject instanceof Buffer)) {
      throw new MindeeInputSourceError(
        `MIME type cannot be verified on input source of type ${this.inputType}.`
      );
    }
    let mimeType: string;
    const fileExt = path.extname(this.filename);
    if (fileExt) {
      mimeType = MIMETYPES.get(fileExt.toLowerCase()) || "";
    } else {
      const guess = await fileTypeFromBuffer(this.fileObject);
      if (guess !== undefined) {
        mimeType = guess.mime;
      } else {
        throw "Could not determine the MIME type of the file";
      }
    }
    if (!mimeType) {
      const allowed = Array.from(MIMETYPES.keys()).join(", ");
      const err = new MindeeInputSourceError(
        `Invalid file type, must be one of ${allowed}.`
      );
      errorHandler.throw(err);
    }
    logger.debug(`File is of type: ${mimeType}`);
    return mimeType;
  }

  /**
   * Returns the file object as a Buffer.
   * @returns Buffer representation of the file object
   * @protected
   */
  protected getBuffer(): Buffer {
    if (typeof this.fileObject === "string") {
      return Buffer.from(this.fileObject);
    }
    return this.fileObject;
  }

  /**
   * Determines whether the current file is a PDF.
   * @returns {boolean} Returns true if the file is a PDF; otherwise, returns false.
   */
  isPdf(): boolean {
    if (!this.initialized) {
      throw new MindeeInputSourceError(
        "The `init()` method must be called before calling `isPdf()`."
      );
    }
    return this.mimeType === "application/pdf";
  }

  /**
   * Cut PDF pages.
   * @param pageOptions
   */
  public async applyPageOptions(pageOptions: PageOptions) {
    await this.init();
    const buffer = this.getBuffer();
    const processedPdf = await extractPages(buffer, pageOptions);
    this.fileObject = processedPdf.file;
  }

  /**
   * Compresses the file object, either as a PDF or an image.
   *
   * @param quality Quality of the compression. For images, this is the JPEG quality.
   * For PDFs, this affects image quality within the PDF.
   * @param maxWidth Maximum width for image resizing. Ignored for PDFs.
   * @param maxHeight Maximum height for image resizing. Ignored for PDFs.
   * @param forceSourceText For PDFs, whether to force compression even if source text is present.
   * @param disableSourceText For PDFs, whether to disable source text during compression.
   *
   * @returns A Promise that resolves when the compression is complete.
   */
  public async compress(
    quality: number = 85,
    maxWidth: number | null = null,
    maxHeight: number | null = null,
    forceSourceText: boolean = false,
    disableSourceText: boolean = true
  ) {
    await this.init();
    const buffer = this.getBuffer();
    if (this.isPdf()){
      this.fileObject = await compressPdf(buffer, quality, forceSourceText, disableSourceText);
    } else {
      this.fileObject = await compressImage(buffer, quality, maxWidth, maxHeight);
    }
  }

  /**
   * Returns true if the object is a PDF and has source text. False otherwise.
   * @return boolean
   */
  public async hasSourceText() {
    await this.init();
    if (!this.isPdf()){
      return false;
    }
    const buffer = this.getBuffer();
    return hasSourceText(buffer);
  }

  /**
   * Returns the number of pages in the input source.
   * For PDFs, returns the actual page count. For images, returns 1.
   * @return Promise<number> The number of pages
   */
  public async getPageCount(): Promise<number> {
    await this.init();
    if (!this.isPdf()) {
      return 1;
    }
    const buffer = this.getBuffer();
    return countPages(buffer);
  }
}
