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

export abstract class InputSource {
  fileObject: Buffer | string = "";

  async init() {
    throw new Error("not Implemented");
  }
}

