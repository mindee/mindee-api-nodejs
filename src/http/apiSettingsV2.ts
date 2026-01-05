/* eslint-disable @typescript-eslint/naming-convention */
import { logger } from "@/logger.js";
import { BaseSettings, MindeeApiConstructorProps } from "./baseSettings.js";
import { MindeeApiV2Error } from "@/errors/index.js";

export const API_V2_KEY_ENVVAR_NAME: string = "MINDEE_V2_API_KEY";
export const API_V2_HOST_ENVVAR_NAME: string = "MINDEE_V2_API_HOST";
const DEFAULT_MINDEE_API_HOST: string = "api-v2.mindee.net";

export class ApiSettingsV2 extends BaseSettings {
  apiKey: string;
  baseHeaders: Record<string, string>;

  constructor({
    apiKey = "",
  }: MindeeApiConstructorProps) {
    super();
    if (!apiKey || apiKey.length === 0) {
      this.apiKey = this.apiKeyFromEnv();
    } else {
      this.apiKey = apiKey;
    }
    if (!this.apiKey || this.apiKey.length === 0) {
      throw new MindeeApiV2Error(
        "Your API V2 key could not be set, check your Client Configuration\n."
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
        `Set API key from environment: ${API_V2_KEY_ENVVAR_NAME}`
      );
      return envVarValue;
    }
    return "";
  }

  protected hostnameFromEnv(): string {
    const envVarValue = process.env[API_V2_HOST_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(`Set the API hostname to ${envVarValue}`);
      return envVarValue;
    }
    return DEFAULT_MINDEE_API_HOST;
  }


}
