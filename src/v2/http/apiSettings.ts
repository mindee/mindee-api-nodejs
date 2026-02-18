import { logger } from "@/logger.js";
import { BaseSettings, MindeeApiConstructorProps } from "@/http/baseSettings.js";
import { MindeeConfigurationError } from "@/errors/index.js";

const API_V2_KEY_ENVVAR_NAME: string = "MINDEE_V2_API_KEY";
const API_V2_HOST_ENVVAR_NAME: string = "MINDEE_V2_API_HOST";
const DEFAULT_MINDEE_API_HOST: string = "api-v2.mindee.net";

export class ApiSettings extends BaseSettings {
  baseHeaders: Record<string, string>;

  constructor({
    apiKey,
    dispatcher,
  }: MindeeApiConstructorProps) {
    super(apiKey, dispatcher);
    if (!this.apiKey || this.apiKey.length === 0) {
      throw new MindeeConfigurationError(
        "Your V2 API key could not be set, check your Client Configuration\n."
        + `You can set this using the ${API_V2_KEY_ENVVAR_NAME} environment variable.`
      );
    }
    /* eslint-disable @typescript-eslint/naming-convention */
    this.baseHeaders = {
      "User-Agent": this.getUserAgent(),
      Authorization: `${this.apiKey}`,
    };
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  protected apiKeyFromEnv(): string {
    const envVarValue = process.env[API_V2_KEY_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(
        "Set the V2 API key from the environment"
      );
      return envVarValue;
    }
    return "";
  }

  protected hostnameFromEnv(): string {
    const envVarValue = process.env[API_V2_HOST_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(`Set the V2 API hostname from the environment to: ${envVarValue}`);
      return envVarValue;
    }
    return DEFAULT_MINDEE_API_HOST;
  }

}
