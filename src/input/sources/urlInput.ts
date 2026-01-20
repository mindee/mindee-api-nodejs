import { InputSource } from "./inputSource";
import { URL } from "url";
import { basename, extname } from "path";
import { randomBytes } from "crypto";
import { writeFile } from "fs/promises";
import { request as httpsRequest } from "https";
import { IncomingMessage } from "http";
import { BytesInput } from "./bytesInput";
import { logger } from "../../logger";
import { MindeeInputError } from "../../errors/mindeeError";

export class UrlInput extends InputSource {
  public readonly url: string;
  private signal?: AbortSignal;

  constructor({ url, signal }: { url: string, signal?: AbortSignal}) {
    super();
    this.url = url;
    this.signal = signal;
  }

  async init(signal?: AbortSignal) {
    if (this.initialized) {
      return;
    }
    this.signal = signal ?? this.signal;

    logger.debug(`source URL: ${this.url}`);
    if (!this.url.toLowerCase().startsWith("https")) {
      throw new MindeeInputError("URL must be HTTPS");
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
    signal?: AbortSignal;
  }): Promise<{ content: Buffer; finalUrl: string }> {
    const { username, password, token, headers = {}, maxRedirects = 3, signal } = options;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const auth = username && password ? `${username}:${password}` : undefined;

    return await this.makeRequest(this.url, auth, headers, 0, maxRedirects, signal);
  }

  async saveToFile(options: {
    filepath: string;
    filename?: string;
    username?: string;
    password?: string;
    token?: string;
    headers?: Record<string, string>;
    maxRedirects?: number;
    signal?: AbortSignal;
  }): Promise<string> {
    const { filepath, filename, signal, ...fetchOptions } = options;
    const effectiveSignal = signal ?? this.signal;
    const { content, finalUrl } = await this.fetchFileContent({ ...fetchOptions, signal: effectiveSignal });
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
    signal?: AbortSignal;
  } = {}): Promise<BytesInput> {
    const { filename, signal, ...fetchOptions } = options;
    const effectiveSignal = signal ?? this.signal;
    const { content, finalUrl } = await this.fetchFileContent({ ...fetchOptions, signal: effectiveSignal });
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
    maxRedirects: number,
    signal?: AbortSignal
  ): Promise<{ content: Buffer; finalUrl: string }> {
    if (signal?.aborted) {
      throw new MindeeInputError("Operation aborted");
    }

    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers: headers,
      auth: auth,
    };

    const response = await new Promise<IncomingMessage>((resolve, reject) => {
      if (signal?.aborted) {
        return reject(new MindeeInputError("Operation aborted"));
      }

      const onAbort = () => {
        req.destroy();
        reject(new MindeeInputError("Operation aborted"));
      };

      if (signal) {
        signal.addEventListener("abort", onAbort, { once: true });
      }

      const req = httpsRequest(options, (res) => {
        signal?.removeEventListener("abort", onAbort);
        resolve(res);
      });
      req.on("error", (err) => {
        signal?.removeEventListener("abort", onAbort);
        reject(err);
      });
      req.end();
    });

    if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400) {
      if (redirects === maxRedirects) {
        throw new MindeeInputError(
          `Can't reach URL after ${redirects} out of ${maxRedirects} redirects, aborting operation.`
        );
      }
      if (response.headers.location) {
        return await this.makeRequest(response.headers.location, auth, headers, redirects + 1, maxRedirects, signal);
      }
      throw new MindeeInputError("Redirect location not found");
    }

    if (!response.statusCode || response.statusCode >= 400 || response.statusCode < 200) {
      throw new MindeeInputError(`Couldn't retrieve file from server, error code ${response.statusCode}.`);
    }

    const chunks: Buffer[] = [];
    try {
      for await (const chunk of response) {
        if (signal?.aborted) {
          response.destroy();
          throw new MindeeInputError("Operation aborted");
        }
        chunks.push(chunk);
      }
    } catch (err) {
      response.destroy();
      throw err;
    }
    return { content: Buffer.concat(chunks), finalUrl: url };
  }
}
