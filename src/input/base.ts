import * as fileType from "file-type";
import * as path from "path";
import { PageOptions } from "./pageOptions";
import { extractPages } from "../pdf";
import { logger } from "../logger";
import { errorHandler } from "../errors/handler";

/**
 * @param {string} inputType - the type of input used in file ("base64", "path", "dummy").
 *                             NB: dummy is only used for tests purposes
 */
interface InputConstructor {
  inputType: string;
}

export const INPUT_TYPE_STREAM = "stream";
export const INPUT_TYPE_BASE64 = "base64";
export const INPUT_TYPE_BYTES = "bytes";
export const INPUT_TYPE_PATH = "path";
export const INPUT_TYPE_BUFFER = "buffer";

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

export abstract class InputSource {
  fileObject: Buffer | string = "";

  async init() {
    throw new Error("not Implemented");
  }
}

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
   * Merge PDF pages.
   * @param pageOptions
   */
  async cutPdf(pageOptions: PageOptions) {
    if (!(this.fileObject instanceof Buffer)) {
      throw new Error(
        `Cannot modify an input source of type ${this.inputType}.`
      );
    }
    const processedPdf = await extractPages(this.fileObject, pageOptions);
    this.fileObject = processedPdf.file;
  }
}
