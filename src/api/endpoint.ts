import * as https from "https";
import * as os from "os";

import { version as sdkVersion } from "../../package.json";
import { URL } from "url";
import FormData from "form-data";
import { InputSource } from "../inputs";
import { logger } from "../logger";
import { IncomingMessage } from "http";

const MINDEE_API_URL = "https://api.mindee.net/v1";
const USER_AGENT = `mindee-api-nodejs@v${sdkVersion} nodejs-${
  process.version
} ${os.type().toLowerCase()}`;

export const STANDARD_API_OWNER = "mindee";
export const API_KEY_ENVVAR_NAME = "MINDEE_API_KEY";

export interface predictResponse {
  messageObj: IncomingMessage;
  data: { [key: string]: any };
}

export class Endpoint {
  apiKey: string;
  urlName: string;
  owner: string;
  version: string;
  urlRoot: string;
  private readonly baseHeaders: { [key: string]: string };

  constructor(owner: string, urlName: string, version: string, apiKey: string) {
    this.owner = owner;
    this.urlName = urlName;
    this.version = version;
    this.apiKey = apiKey || this.apiKeyFromEnv();
    this.urlRoot = `${MINDEE_API_URL}/products/${owner}/${urlName}/v${version}`;
    this.baseHeaders = {
      "User-Agent": USER_AGENT,
      Authorization: `Token ${this.apiKey}`,
    };
  }

  /**
   * Make a request to POST a document for prediction.
   * @param input
   * @param includeWords
   * @param cropper
   */
  predictReqPost(
    input: InputSource,
    includeWords = false,
    cropper = false
  ): Promise<predictResponse> {
    return new Promise((resolve, reject) => {
      const uri = new URL(`${this.urlRoot}/predict`);
      if (cropper) {
        uri.searchParams.append("cropper", "true");
      }
      logger.debug(`Request URI: ${uri}`);

      const form = new FormData();

      if (input.fileObject instanceof Buffer) {
        form.append("document", input.fileObject, { filename: input.filename });
      } else {
        form.append("document", input.fileObject);
      }

      if (includeWords) {
        form.append("include_mvision", "true");
      }
      const headers = { ...this.baseHeaders, ...form.getHeaders() };

      const options = {
        method: "POST",
        headers: headers,
        hostname: uri.hostname,
        path: `${uri.pathname}${uri.search}`,
      };
      const req = https.request(options, function (res: IncomingMessage) {
        // when the encoding is set, data chunks will be strings
        res.setEncoding("utf-8");

        let responseBody = "";
        res.on("data", function (chunk: string) {
          responseBody += chunk;
        });

        res.on("end", function () {
          try {
            resolve({
              messageObj: res,
              data: JSON.parse(responseBody),
            });
          } catch (error) {
            reject(error);
          }
        });
      });

      form.pipe(req);

      req.on("error", (err: any) => {
        reject(err);
      });
    });
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
}

export class StandardEndpoint extends Endpoint {
  constructor(endpointName: string, version: string, apiKey: string) {
    super(STANDARD_API_OWNER, endpointName, version, apiKey);
  }
}

export class CustomEndpoint extends Endpoint {
  constructor(
    endpointName: string,
    accountName: string,
    version: string,
    apiKey: string
  ) {
    super(accountName, endpointName, version, apiKey);
  }
}
