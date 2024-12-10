import { InputSource } from "./inputSource";

export class UrlInput extends InputSource {
  private readonly url: string;

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
}
