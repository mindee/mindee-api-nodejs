/* eslint-disable @typescript-eslint/naming-convention */
import { logger } from "../logger";
import { version as sdkVersion } from "../../package.json";
import * as os from "os";

export const API_KEY_ENVVAR_NAME: string = "MINDEE_API_KEY";
export const API_HOST_ENVVAR_NAME: string = "MINDEE_API_HOST";
export const STANDARD_API_OWNER: string = "mindee";
export const TIMEOUT_DEFAULT: number = 120;
const DEFAULT_MINDEE_API_HOST: string = "api.mindee.net";

interface MindeeApiConstructorProps {
  apiKey: string;
}

export class ApiSettings {
  apiKey: string;
  baseHeaders: Record<string, string>;
  hostname: string;
  timeout: number;

  constructor({
    apiKey = "",
  }: MindeeApiConstructorProps) {
    if (!apiKey || apiKey.length === 0) {
      this.apiKey = this.apiKeyFromEnv();
    } else {
      this.apiKey = apiKey;
    }
    if (!this.apiKey || this.apiKey.length === 0) {
      throw new Error(
        "Your API key could not be set, check your Client Configuration\n."
        + `You can set this using the ${API_KEY_ENVVAR_NAME} environment variable.`
      );
    }
    this.baseHeaders = {
      "User-Agent": this.getUserAgent(),
      Authorization: `Token ${this.apiKey}`,
    };
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

  protected apiKeyFromEnv(): string {
    const envVarValue = process.env[API_KEY_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(
        `Set API key from environment: ${API_KEY_ENVVAR_NAME}`
      );
      return envVarValue;
    }
    return "";
  }

  protected hostnameFromEnv(): string {
    const envVarValue = process.env[API_HOST_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(`Set the API hostname to ${envVarValue}`);
      return envVarValue;
    }
    return DEFAULT_MINDEE_API_HOST;
  }
}
