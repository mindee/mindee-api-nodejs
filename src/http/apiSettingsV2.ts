/* eslint-disable @typescript-eslint/naming-convention */
import { logger } from "@/logger.js";
import { BaseSettings, MindeeApiConstructorProps } from "./baseSettings.js";
import { MindeeApiV2Error } from "@/errors/index.js";

export const API_V2_KEY_ENVVAR_NAME: string = "MINDEE_V2_API_KEY";
export const API_V2_HOST_ENVVAR_NAME: string = "MINDEE_V2_API_HOST";
const DEFAULT_MINDEE_API_HOST: string = "api-v2.mindee.net";

export class ApiSettingsV2 extends BaseSettings {
  baseHeaders: Record<string, string>;

  constructor({
    apiKey,
    dispatcher,
  }: MindeeApiConstructorProps) {
    super(apiKey, dispatcher);
    if (!this.apiKey || this.apiKey.length === 0) {
      throw new MindeeApiV2Error(
        "Your V2 API key could not be set, check your Client Configuration\n."
        + `You can set this using the ${API_V2_KEY_ENVVAR_NAME} environment variable.`
      );
    }
    this.baseHeaders = {
      "User-Agent": this.getUserAgent(),
      Authorization: `${apiKey}`,
    };
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
