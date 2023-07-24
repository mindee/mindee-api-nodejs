import { logger } from "../logger";
import { version as sdkVersion } from "../../package.json";
import * as os from "os";

export const API_KEY_ENVVAR_NAME = "MINDEE_API_KEY";
export const API_HOST_ENVVAR_NAME = "MINDEE_API_HOST";
export const STANDARD_API_OWNER = "mindee";
const DEFAULT_MINDEE_API_HOST = "api.mindee.net";

interface MindeeApiConstructorProps {
  apiKey: string;
  urlName: string;
  version: string;
  owner: string;
}
const USER_AGENT = `mindee-api-nodejs@v${sdkVersion} nodejs-${
  process.version
} ${os.type().toLowerCase()}`;

export class MindeeApi {
  apiKey: string;
  baseHeaders: Record<string, string>;
  hostname: string;
  private readonly urlName: string;
  private readonly version: string;

  constructor({
    apiKey = "",
    urlName,
    version,
    owner,
  }: MindeeApiConstructorProps) {
    if (!apiKey || apiKey.length === 0) {
      if (
        !process.env[API_KEY_ENVVAR_NAME] ||
        process.env[API_KEY_ENVVAR_NAME].length === 0
      ) {
        throw new Error(`Missing API key for ${urlName} v${version} (belonging to ${owner}) check your Client Configuration.
You can set this using the ${API_KEY_ENVVAR_NAME} environment variable.`);
      }
      this.apiKey = process.env[API_KEY_ENVVAR_NAME];
    } else {
      this.apiKey = apiKey;
    }
    this.baseHeaders = {
      "User-Agent": USER_AGENT,
      Authorization: `Token ${this.apiKey}`,
    };
    this.hostname = this.hostnameFromEnv();
    this.urlName = urlName;
    this.version = version;
  }

  protected apiKeyFromEnv(): string {
    const envVarValue = process.env[API_KEY_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(
        `Set ${this.urlName} v${this.version} API key from environment: ${API_KEY_ENVVAR_NAME}`
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
