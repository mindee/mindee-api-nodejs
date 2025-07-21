import { errorHandler } from "../../errors/handler";
import { logger } from "../../logger";
import { compressImage } from "../../imageOperations";
import { compressPdf } from "../../pdf";
import path from "path";
import * as fileType from "file-type";
import { PageOptions } from "../pageOptions";
import { extractPages, hasSourceText } from "../../pdf";
import {
  InputSource,
  InputConstructor,
  INPUT_TYPE_STREAM,
  INPUT_TYPE_BASE64,
  INPUT_TYPE_BYTES,
  INPUT_TYPE_PATH, INPUT_TYPE_BUFFER
} from "./inputSource";

const MIMETYPES = new Map<string, string>([
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
        new Error(`Invalid input type, must be one of ${allowed}.`)
      );
    }
    this.inputType = inputType;
    logger.debug(`Loading file from: ${inputType}`);
  }

  isPdf(): boolean {
    return this.mimeType === "application/pdf";
  }

  async checkMimetype(): Promise<string> {
    if (!(this.fileObject instanceof Buffer)) {
      throw new Error(
        `MIME type cannot be verified on input source of type ${this.inputType}.`
      );
    }
    let mimeType: string;
    const fileExt = path.extname(this.filename);
    if (fileExt) {
      mimeType = MIMETYPES.get(fileExt.toLowerCase()) || "";
    } else {
      const guess = await fileType.fromBuffer(this.fileObject);
      if (guess !== undefined) {
        mimeType = guess.mime;
      } else {
        throw "Could not determine the MIME type of the file";
      }
    }
    if (!mimeType) {
      const allowed = Array.from(MIMETYPES.keys()).join(", ");
      const err = new Error(`Invalid file type, must be one of ${allowed}.`);
      errorHandler.throw(err);
    }
    logger.debug(`File is of type: ${mimeType}`);
    return mimeType;
  }

  /**
   * Cut PDF pages.
   * @param pageOptions
   */
  async applyPageOptions(pageOptions: PageOptions) {
    if (!(this.fileObject instanceof Buffer)) {
      throw new Error(
        `Cannot modify an input source of type ${this.inputType}.`
      );
    }
    const processedPdf = await extractPages(this.fileObject, pageOptions);
    this.fileObject = processedPdf.file;
  }

  /**
   * Cut PDF pages.
   * @param pageOptions
   * @deprecated Deprecated in favor of {@link LocalInputSource.applyPageOptions applyPageOptions()}.
   */
  async cutPdf(pageOptions: PageOptions) {
    return this.applyPageOptions(pageOptions);
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
  async compress(
    quality: number = 85,
    maxWidth: number | null = null,
    maxHeight: number | null = null,
    forceSourceText: boolean = false,
    disableSourceText: boolean = true
  ) {
    let buffer: Buffer;
    if (typeof this.fileObject === "string") {
      buffer = Buffer.from(this.fileObject);
    } else {
      buffer = this.fileObject;
    }
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
  async hasSourceText() {
    if (!this.isPdf()){
      return false;
    }
    const buffer = typeof this.fileObject === "string" ? Buffer.from(this.fileObject) : this.fileObject;
    return hasSourceText(buffer);
  }
}
