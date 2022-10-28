import * as https from "https";
import * as os from "os";

import { version as sdkVersion } from "../../package.json";
import { URL } from "url";
import FormData from "form-data";
import { Input } from "../inputs";
import { logger } from "../logger";
import { IncomingMessage } from "http";

const MINDEE_API_URL = "https://api.mindee.net/v1";
const USER_AGENT = `mindee-api-nodejs@v${sdkVersion} nodejs-${
  process.version
} ${os.type().toLowerCase()}`;

export const STANDARD_API_OWNER = "mindee";
export const API_KEY_ENVVAR_NAME = "MINDEE_API_KEY";

export class Endpoint {
  apiKey: string;
  urlName: string;
  keyName: string;
  owner: string;
  version: string;
  urlRoot: string;

  constructor(
    owner: string,
    urlName: string,
    version: string,
    apiKey: string,
    keyName?: string
  ) {
    this.owner = owner;
    this.urlName = urlName;
    this.version = version;
    this.keyName = keyName || urlName;
    this.apiKey = apiKey || this.apiKeyFromEnv();
    this.urlRoot = `${MINDEE_API_URL}/products/${owner}/${urlName}/v${version}`;
  }

  /**
   * Make a prediction request.
   */
  predictRequest(input: Input, includeWords = false, cropper = false) {
    return new Promise((resolve, reject) => {
      let headers: { [key: string]: string | number } = {
        "User-Agent": USER_AGENT,
        Authorization: `Token ${this.apiKey}`,
      };
      const uri = new URL(`${this.urlRoot}/predict`);
      if (cropper) {
        uri.searchParams.append("cropper", "true");
      }
      logger.debug(`Prediction request: ${uri}`);

      const form = new FormData();
      const fileParams = { filename: input.filename };
      form.append("document", input.fileObject, fileParams);
      if (includeWords) {
        form.append("include_mvision", "true");
      }
      headers = { ...headers, ...form.getHeaders() };

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
              ...res,
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
        `Set '${this.keyName}' API key from environment: ${API_KEY_ENVVAR_NAME}`
      );
      return envVarValue;
    }
    return "";
  }
}

export class InvoiceEndpoint extends Endpoint {
  constructor(apiKey: string) {
    super(STANDARD_API_OWNER, "invoices", "3", apiKey, "invoice");
  }
}

export class ReceiptEndpoint extends Endpoint {
  constructor(apiKey: string) {
    super(STANDARD_API_OWNER, "expense_receipts", "3", apiKey, "receipt");
  }
}

export class PassportEndpoint extends Endpoint {
  constructor(apiKey: string) {
    super(STANDARD_API_OWNER, "passport", "1", apiKey);
  }
}

export class CropperEndpoint extends Endpoint {
  constructor(apiKey: string) {
    super(STANDARD_API_OWNER, "cropper", "1", apiKey);
  }
}

export class CustomEndpoint extends Endpoint {
  constructor(
    documentType: string,
    accountName: string,
    version: string,
    apiKey: string
  ) {
    super(accountName, documentType, version, apiKey);
  }
}
