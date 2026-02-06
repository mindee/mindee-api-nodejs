import { InputSource } from "./inputSource.js";
import { URL } from "url";
import { basename, extname } from "path";
import { randomBytes } from "crypto";
import { writeFile } from "fs/promises";
import {  request, Dispatcher, getGlobalDispatcher } from "undici";
import { BytesInput } from "./bytesInput.js";
import { logger } from "@/logger.js";

export class UrlInput extends InputSource {
  public readonly url: string;
  public readonly dispatcher;

  constructor({ url, dispatcher }: { url: string, dispatcher?: Dispatcher }) {
    super();
    this.url = url;
    this.dispatcher = dispatcher ?? getGlobalDispatcher();
    logger.debug("Initialized URL input source.");
  }

  async init() {
    if (this.initialized) {
      return;
    }
    logger.debug(`source URL: ${this.url}`);
    if (!this.url.toLowerCase().startsWith("https")) {
      throw new Error("URL must be HTTPS");
    }
    this.fileObject = this.url;
    this.initialized = true;
  }

  private async fetchFileContent(options: {
    username?: string;
    password?: string;
    token?: string;
    headers?: Record<string, string>;
    maxRedirects?: number;
  }): Promise<{ content: Buffer; finalUrl: string }> {
    const { username, password, token, headers = {}, maxRedirects = 3 } = options;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const auth = username && password ? `${username}:${password}` : undefined;

    return await this.makeRequest(this.url, auth, headers, 0, maxRedirects);
  }

  async saveToFile(options: {
    filepath: string;
    filename?: string;
    username?: string;
    password?: string;
    token?: string;
    headers?: Record<string, string>;
    maxRedirects?: number;
  }): Promise<string> {
    const { filepath, filename, ...fetchOptions } = options;
    const { content, finalUrl } = await this.fetchFileContent(fetchOptions);
    const finalFilename = this.fillFilename(filename, finalUrl);
    const fullPath = `${filepath}/${finalFilename}`;
    await writeFile(fullPath, content);
    return fullPath;
  }

  async asLocalInputSource(options: {
    filename?: string;
    username?: string;
    password?: string;
    token?: string;
    headers?: Record<string, string>;
    maxRedirects?: number;
  } = {}): Promise<BytesInput> {
    const { filename, ...fetchOptions } = options;
    const { content, finalUrl } = await this.fetchFileContent(fetchOptions);
    const finalFilename = this.fillFilename(filename, finalUrl);
    return new BytesInput({ inputBytes: content, filename: finalFilename });
  }

  private static extractFilenameFromUrl(uri: string): string {
    return basename(new URL(uri).pathname || "");
  }

  private static generateFileName(extension = ".tmp"): string {
    const randomString = randomBytes(4).toString("hex");
    const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
    return `mindee_temp_${timestamp}_${randomString}${extension}`;
  }

  private static getFileExtension(filename: string): string | null {
    const ext = extname(filename);
    return ext ? ext.toLowerCase() : null;
  }

  private fillFilename(filename?: string, finalUrl?: string): string {
    if (!filename) {
      filename = finalUrl ? UrlInput.extractFilenameFromUrl(finalUrl) : UrlInput.extractFilenameFromUrl(this.url);
    }

    if (!filename || !extname(filename)) {
      filename = UrlInput.generateFileName(
        UrlInput.getFileExtension(filename || "") || undefined
      );
    }
    return filename;
  }

  private async makeRequest(
    url: string,
    auth: string | undefined,
    headers: Record<string, string>,
    redirects: number,
    maxRedirects: number
  ): Promise<{ content: Buffer; finalUrl: string }> {
    const parsedUrl = new URL(url);

    const response = await request(
      parsedUrl,
      {
        method: "GET",
        headers: headers,
        throwOnError: false,
        dispatcher: this.dispatcher,
      }
    );

    if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400) {
      logger.debug(`Redirecting to: ${response.headers.location}`);
      if (redirects === maxRedirects) {
        throw new Error(
          `Can't reach URL after ${redirects} out of ${maxRedirects} redirects, aborting operation.`
        );
      }
      if (response.headers.location) {
        return await this.makeRequest(
          response.headers.location.toString(), auth, headers, redirects + 1, maxRedirects
        );
      }
      throw new Error("Redirect location not found");
    }

    if (!response.statusCode || response.statusCode >= 400 || response.statusCode < 200) {
      throw new Error(`Couldn't retrieve file from server, error code ${response.statusCode}.`);
    }
    const arrayBuffer = await response.body.arrayBuffer();
    return { content: Buffer.from(arrayBuffer), finalUrl: url };
  }
}
