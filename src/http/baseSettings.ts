import { Dispatcher, getGlobalDispatcher } from "undici";
import packageJson from "../../package.json" with { type: "json" };
import * as os from "os";
import { TIMEOUT_SECS_DEFAULT } from "./apiCore.js";

export interface MindeeApiConstructorProps {
  apiKey?: string;
  dispatcher?: Dispatcher;
}

export abstract class BaseSettings {
  apiKey: string;
  hostname: string;
  timeoutSecs: number;
  dispatcher: Dispatcher;

  protected constructor(apiKey?: string, dispatcher?: Dispatcher) {
    if (apiKey === undefined || !apiKey || apiKey.length === 0) {
      this.apiKey = this.apiKeyFromEnv();
    } else {
      this.apiKey = apiKey;
    }
    this.dispatcher = dispatcher ?? getGlobalDispatcher();
    this.hostname = this.hostnameFromEnv();
    this.timeoutSecs = process.env.MINDEE_REQUEST_TIMEOUT
      ? parseInt(process.env.MINDEE_REQUEST_TIMEOUT)
      : TIMEOUT_SECS_DEFAULT;
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
    return `mindee-api-nodejs@v${packageJson.version} nodejs-${
      process.version
    } ${platform}`;
  }
  protected abstract apiKeyFromEnv(): string;
  protected abstract hostnameFromEnv(): string;
}
