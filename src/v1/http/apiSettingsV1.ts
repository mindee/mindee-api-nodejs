
import { logger } from "@/logger.js";
import { BaseSettings, MindeeApiConstructorProps } from "@/http/baseSettings.js";
import { MindeeConfigurationError } from "@/errors/index.js";

/** Default account owner for built-in v1 APIs. */
export const STANDARD_API_OWNER: string = "mindee";
const API_V1_KEY_ENVVAR_NAME: string = "MINDEE_API_KEY";
const API_V1_HOST_ENVVAR_NAME: string = "MINDEE_API_HOST";
const DEFAULT_MINDEE_API_HOST: string = "api.mindee.net";

/** Runtime settings container for v1 API calls. */
export class ApiSettingsV1 extends BaseSettings {
  /** Default headers sent with each v1 API request. */
  baseHeaders: Record<string, string>;

  constructor({
    apiKey,
    dispatcher,
  }: MindeeApiConstructorProps) {
    super(apiKey, dispatcher);
    if (!this.apiKey || this.apiKey.length === 0) {
      throw new MindeeConfigurationError(
        "Your V1 API key could not be set, check your Client Configuration\n."
        + `You can set this using the ${API_V1_KEY_ENVVAR_NAME} environment variable.`
      );
    }
    /* eslint-disable @typescript-eslint/naming-convention */
    this.baseHeaders = {
      "User-Agent": this.getUserAgent(),
      Authorization: `Token ${this.apiKey}`,
    };
  }

  /** Resolves the API key from environment variables. */
  protected apiKeyFromEnv(): string {
    const envVarValue = process.env[API_V1_KEY_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(
        "Set the V1 API key from the environment"
      );
      return envVarValue;
    }
    return "";
  }

  /** Resolves the API hostname from environment variables. */
  protected hostnameFromEnv(): string {
    const envVarValue = process.env[API_V1_HOST_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(`Set the V1 API hostname from the environment to: ${envVarValue}`);
      return envVarValue;
    }
    return DEFAULT_MINDEE_API_HOST;
  }
}
