import { MindeeInputSourceError } from "@/errors/index.js";

/**
 * @param {string} inputType - the type of input used in file ("base64", "path", "dummy").
 *                             NB: dummy is only used for tests purposes
 */
export interface InputConstructor {
  inputType: string;
}

export const INPUT_TYPE_STREAM = "stream";
export const INPUT_TYPE_BASE64 = "base64";
export const INPUT_TYPE_BYTES = "bytes";
export const INPUT_TYPE_PATH = "path";
export const INPUT_TYPE_BUFFER = "buffer";

/**
 * Abstract class for input sources.
 */
export abstract class InputSource {
  /**
   * The file object used by the input source.
   */
  fileObject: Buffer | string = "";
  /**
   * Whether the input source has been initialized.
   * @protected
   */
  /** Whether the source has already been initialized. */
  protected initialized: boolean = false;

  /** Initializes the input source and populates its file object. */
  async init() {
    throw new MindeeInputSourceError("not Implemented");
  }

  /**
   * Returns whether the input source has been initialized.
   */
  public isInitialized() {
    return this.initialized;
  }
}
