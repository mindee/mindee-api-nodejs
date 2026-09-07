import * as crypto from "crypto";
import * as fs from "node:fs/promises";
import { StringDict } from "@/parsing/stringDict.js";
import { MindeeError } from "@/errors/index.js";
import { Buffer } from "buffer";

/**
 * Local response loaded from a file.
 * Note: Has to be initialized through init() before use.
 */
export abstract class BaseLocalResponse {
  private fileBytes: Buffer;
  private readonly inputHandle: Buffer | string;
  /** Whether the local response payload has been loaded. */
  protected initialized = false;

  /**
   * Creates an instance of LocalResponse.
   */
  constructor(inputFile: Buffer | string) {
    if (inputFile === undefined || inputFile === null) {
      throw new TypeError("input cannot be null or undefined");
    }
    if (typeof inputFile === "string" ? !inputFile.trim() : !inputFile.length) {
      throw new TypeError("input cannot be empty");
    }
    this.fileBytes = Buffer.alloc(0);
    this.inputHandle = inputFile;
  }

  /** Loads the local payload from a string, buffer, or file path. */
  public async init() {
    /**
     * @param inputFile - The input file, which can be a Buffer, string, or PathLike.
     */
    if (this.initialized) {
      return;
    }
    if (Buffer.isBuffer(this.inputHandle)) {
      this.fileBytes = this.inputHandle;
    } else if (typeof this.inputHandle === "string") {
      let fileContents;
      try {
        await fs.access(this.inputHandle);
        fileContents = await fs.readFile(this.inputHandle, { encoding: "utf-8" });
      } catch {
        fileContents = this.inputHandle;
      }
      this.fileBytes = Buffer.from(
        fileContents.replace(/\r/g, "").replace(/\n/g, ""),
        "utf-8"
      );
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
      const content = this.fileBytes.toString("utf-8");
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
      hmac.update(this.fileBytes);
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
    if (
      (!signature || !signature?.trim())
      || (!secretKey || (typeof secretKey === "string" ? !secretKey?.trim() : !secretKey?.length))
    ) {
      return false;
    }

    const expectedSignature = this.getHmacSignature(secretKey);
    if (!expectedSignature?.trim()) {
      return false;
    }

    const expectedBytes = Buffer.from(expectedSignature, "utf-8");
    const actualBytes = Buffer.from(signature.toLowerCase(), "utf-8");

    if (expectedBytes.length !== actualBytes.length) {
      return false;
    }
    return crypto.timingSafeEqual(expectedBytes, actualBytes);
  }

  /**
   * Print the file as a UTF-8 string.
   */
  public toString(): string {
    return this.fileBytes.toString("utf-8");
  }
}
