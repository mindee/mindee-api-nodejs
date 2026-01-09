
import { logger } from "@/logger.js";
import { BaseSettings, MindeeApiConstructorProps } from "../../http/baseSettings.js";
import { MindeeConfigurationError } from "@/errors/index.js";

export const STANDARD_API_OWNER: string = "mindee";
const API_V1_KEY_ENVVAR_NAME: string = "MINDEE_API_KEY";
const API_V1_HOST_ENVVAR_NAME: string = "MINDEE_API_HOST";
const DEFAULT_MINDEE_API_HOST: string = "api.mindee.net";

export class ApiSettingsV1 extends BaseSettings {
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

  protected hostnameFromEnv(): string {
    const envVarValue = process.env[API_V1_HOST_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(`Set the V1 API hostname from the environment to: ${envVarValue}`);
      return envVarValue;
    }
    return DEFAULT_MINDEE_API_HOST;
  }
}
