import * as crypto from "crypto";
import * as fs from "node:fs/promises";
import { StringDict } from "@/parsing/stringDict.js";
import { MindeeError } from "../errors/index.js";
import { Buffer } from "buffer";

/**
 * Local response loaded from a file.
 * Note: Has to be initialized through init() before use.
 */
export abstract class LocalResponseBase {
  private file: Buffer;
  private readonly inputHandle: Buffer | string;
  protected initialized = false;

  /**
   * Creates an instance of LocalResponse.
   */
  constructor(inputFile: Buffer | string) {
    this.file = Buffer.alloc(0);
    this.inputHandle = inputFile;
  }

  public async init() {
    /**
     * @param inputFile - The input file, which can be a Buffer, string, or PathLike.
     */
    if (Buffer.isBuffer(this.inputHandle)) {
      this.file = this.inputHandle;
    } else if (typeof this.inputHandle === "string") {
      let fileContents;
      try {
        await fs.access(this.inputHandle);
        fileContents = await fs.readFile(this.inputHandle, { encoding: "utf-8" });
      } catch {
        fileContents = this.inputHandle;
      }
      this.file = Buffer.from(fileContents.replace(/\r/g, "").replace(/\n/g, ""), "utf-8");
    } else {
      throw new MindeeError("Incompatible type for input.");
    }
    this.initialized = true;
  }

  /**
   * Returns the dictionary representation of the file.
   * @returns A JSON-like object.
   */
  async asDict(): Promise<StringDict> {
    if (!this.initialized) {
      await this.init();
    }
    try {
      const content = this.file.toString("utf-8");
      return JSON.parse(content);
    } catch {
      throw new MindeeError("File is not a valid dictionary.");
    }
  }

  /**
   * Returns the HMAC signature of the local response from the secret key provided.
   * @param secretKey - Secret key, either a string or a byte/byte array.
   * @returns The HMAC signature of the local response.
   */
  getHmacSignature(secretKey: string | Buffer | Uint8Array): string {
    if (!this.initialized) {
      throw new Error(
        "The `init()` method must be called before calling `getHmacSignature()`."
      );
    }
    const algorithm = "sha256";
    try {
      const hmac = crypto.createHmac(algorithm, secretKey);
      hmac.update(this.file);
      return hmac.digest("hex");
    } catch {
      throw new MindeeError("Could not get HMAC signature from payload.");
    }
  }

  /**
   * Checks if the HMAC signature of the local response is valid.
   * @param secretKey - Secret key, either a string or a byte/byte array.
   * @param signature - The signature to be compared with.
   * @returns True if the HMAC signature is valid.
   */
  public isValidHmacSignature(secretKey: string | Buffer | Uint8Array, signature: string): boolean {
    if (!this.initialized) {
      throw new Error(
        "The `init()` method must be called before calling `isValidHmacSignature()`."
      );
    }
    return signature === this.getHmacSignature(secretKey);
  }
}
