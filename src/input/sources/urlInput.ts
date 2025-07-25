import { InputSource } from "./inputSource";
import { URL } from "url";
import { basename, extname } from "path";
import { randomBytes } from "crypto";
import { writeFile } from "fs/promises";
import { request as httpsRequest } from "https";
import { IncomingMessage } from "http";
import { BytesInput } from "./bytesInput";

export class UrlInput extends InputSource {
  public readonly url: string;

  constructor({ url }: { url: string }) {
    super();
    this.url = url;
  }

  async init() {
    if (!this.url.toLowerCase().startsWith("https")) {
      throw new Error("URL must be HTTPS");
    }
    this.fileObject = this.url;
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
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers: headers,
      auth: auth,
    };

    const response = await new Promise<IncomingMessage>((resolve, reject) => {
      const req = httpsRequest(options, resolve);
      req.on("error", reject);
      req.end();
    });

    if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400) {
      if (redirects === maxRedirects) {
        throw new Error(`Can't reach URL after ${redirects} out of ${maxRedirects} redirects, aborting operation.`);
      }
      if (response.headers.location) {
        return await this.makeRequest(response.headers.location, auth, headers, redirects + 1, maxRedirects);
      }
      throw new Error("Redirect location not found");
    }

    if (!response.statusCode || response.statusCode >= 400 || response.statusCode < 200) {
      throw new Error(`Couldn't retrieve file from server, error code ${response.statusCode}.`);
    }

    const chunks: Buffer[] = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }
    return { content: Buffer.concat(chunks), finalUrl: url };
  }
}
