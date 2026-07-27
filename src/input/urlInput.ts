import { InputSource } from "./inputSource.js";
import { URL } from "url";
import { basename, extname } from "path";
import { randomBytes } from "crypto";
import { writeFile } from "fs/promises";
import {  request, Dispatcher, getGlobalDispatcher } from "undici";
import { logger } from "@/logger.js";
import { MindeeInputSourceError } from "@/errors/index.js";
import { BytesInput } from "./bytesInput.js";

/** Remote input source represented by a validated HTTPS URL. */
export class UrlInput extends InputSource {
  /** HTTPS URL of the remote input file. */
  public readonly url: string;
  /** Dispatcher used for HTTP requests. */
  public readonly dispatcher;

  constructor(
    { url, dispatcher }: { url: string, dispatcher?: Dispatcher }
  ) {
    super();
    this.url = url;
    this.dispatcher = dispatcher ?? getGlobalDispatcher();
    logger.debug("Initialized URL input source.");
  }

  /** Initializes this source by validating and storing the URL. */
  async init() {
    if (this.initialized) {
      return;
    }
    logger.debug(`source URL: ${UrlInput.maskCredentials(this.url)}`);
    UrlInput.validateUrl(this.url);
    this.fileObject = this.url;
    this.initialized = true;
  }

  /**
   * Validates that a URL is safe to fetch: scheme must be https.
   */
  static validateUrl(url: string): void {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new MindeeInputSourceError("Invalid URL");
    }

    if (parsed.protocol !== "https:") {
      throw new MindeeInputSourceError("URL must be HTTPS");
    }
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
    } else if (username && password) {
      const encoded = Buffer.from(`${username}:${password}`).toString("base64");
      headers["Authorization"] = `Basic ${encoded}`;
    }

    return await this.makeRequest(this.url, headers, 0, maxRedirects);
  }

  /** Downloads the URL content and writes it to disk. */
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

  /** Downloads the URL content and returns it as a local bytes source. */
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

  private static maskCredentials(url: string): string {
    try {
      const parsed = new URL(url);
      if (parsed.username || parsed.password) {
        parsed.username = "******";
        parsed.password = "******";
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }

  private static isSameOrigin(a: string, b: string): boolean {
    const urlA = new URL(a);
    const urlB = new URL(b);
    return urlA.origin === urlB.origin;
  }

  private async makeRequest(
    url: string,
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
        dispatcher: this.dispatcher,
      }
    );

    if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400) {
      logger.debug(`Redirecting to: ${UrlInput.maskCredentials(response.headers.location?.toString() ?? "")}`);
      if (redirects === maxRedirects) {
        throw new MindeeInputSourceError(
          `Can't reach URL after ${redirects} out of ${maxRedirects} redirects, aborting operation.`
        );
      }
      if (response.headers.location) {
        const redirectUrl = new URL(response.headers.location.toString(), url).toString();
        UrlInput.validateUrl(redirectUrl);
        const redirectHeaders = UrlInput.isSameOrigin(url, redirectUrl)
          ? headers
          : Object.fromEntries(
            Object.entries(headers).filter(([k]) => k.toLowerCase() !== "authorization")
          );
        return await this.makeRequest(
          redirectUrl, redirectHeaders, redirects + 1, maxRedirects
        );
      }
      throw new MindeeInputSourceError("Redirect location not found");
    }

    if (!response.statusCode || response.statusCode >= 400 || response.statusCode < 200) {
      throw new Error(`Couldn't retrieve file from server, error code ${response.statusCode}.`);
    }
    const arrayBuffer = await response.body.arrayBuffer();
    return { content: Buffer.from(arrayBuffer), finalUrl: url };
  }
}
