import { version as sdkVersion } from "../../package.json";
import * as os from "os";
import { TIMEOUT_DEFAULT } from "./apiSettings";

export interface MindeeApiConstructorProps {
  apiKey?: string;
}

export abstract class BaseSettings {
  hostname: string;
  timeout: number;

  protected constructor() {
    this.hostname = this.hostnameFromEnv();
    this.timeout = process.env.MINDEE_REQUEST_TIMEOUT ? parseInt(process.env.MINDEE_REQUEST_TIMEOUT) : TIMEOUT_DEFAULT;
  }

  protected getUserAgent(): string {
    let platform = os.type().toLowerCase();
    if (platform.includes("darwin")) {
      platform = "macos";
    }
    else if (platform.includes("window")) {
      platform = "windows";
    }
    else if (platform.includes("bsd")) {
      platform = "bsd";
    }
    return `mindee-api-nodejs@v${sdkVersion} nodejs-${
      process.version
    } ${platform}`;
  }
  protected abstract apiKeyFromEnv(): string;
  protected abstract hostnameFromEnv(): string;
}
