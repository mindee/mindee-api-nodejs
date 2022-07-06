import * as https from "https";
import * as os from "os";

import { version as sdkVersion } from "../../package.json";
import { URL } from "url";
import FormData from "form-data";
import { Input } from "../inputs";
import { logger } from "../logger";

const MINDEE_API_URL = "https://api.mindee.net/v1";
const USER_AGENT = `mindee-api-nodejs@v${sdkVersion} nodejs-${
  process.version
} ${os.type().toLowerCase()}`;

const OTS_OWNER = "mindee";

const INVOICE_URL_NAME = "invoices";
const INVOICE_VERSION = "3";

const RECEIPT_URL_NAME = "expense_receipts";
const RECEIPT_VERSION = "3";

const PASSPORT_URL_NAME = "passport";
const PASSPORT_VERSION = "1";

function toSnakeCase(name: string): string {
  return name
    .trim()
    .split(/(?=[A-Z-])/g)
    .join("_");
}

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

  envVarKeyName(): string {
    let envKeyName: string = toSnakeCase(this.keyName);
    if (this.owner !== OTS_OWNER) {
      envKeyName = `${toSnakeCase(this.owner)}_${envKeyName}`;
    }
    return `MINDEE_${envKeyName}_API_KEY`.toUpperCase();
  }

  /**
   * Make a prediction request.
   */
  predictRequest(input: Input, includeWords = false) {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      let body;
      let headers: { [key: string]: string | number } = {
        "User-Agent": USER_AGENT,
        Authorization: `Token ${this.apiKey}`,
      };

      // TODO: redo this section given there should only
      //       be a single way of reading the input doc
      if (["path", "stream"].includes(input.inputType)) {
        const fileParams = { filename: input.filename };
        form.append("document", input.fileObject, fileParams);
        if (includeWords) {
          form.append("include_mvision", "true");
        }
        headers = { ...headers, ...form.getHeaders() };
      } else if (input.inputType === "base64") {
        const bodyObj: any = { document: input.fileObject };
        if (includeWords) {
          bodyObj["include_mvision"] = "true";
        }
        body = JSON.stringify(bodyObj);
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = body.length;
      }

      const uri = new URL(`${this.urlRoot}/predict`);
      const options = {
        method: "POST",
        headers: headers,
        hostname: uri.hostname,
        path: `${uri.pathname}${uri.search}`,
      };

      const req = https.request(options, function (res: any) {
        let responseBody: any = [];

        res.on("data", function (chunk: any) {
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

      req.on("error", (err: any) => {
        reject(err);
      });

      if (["path", "stream"].includes(input.inputType)) {
        form.pipe(req);
      }

      if (input.inputType === "base64") {
        req.write(body);
        req.end();
      }
    });
  }

  protected apiKeyFromEnv(): string {
    const envVarName = this.envVarKeyName();
    const envVarValue = process.env[envVarName];
    if (envVarValue) {
      logger.debug("Set from environment: %s", envVarName);
      return envVarValue;
    }
    return "";
  }
}

export class InvoiceEndpoint extends Endpoint {
  constructor(apiKey: string) {
    super(OTS_OWNER, INVOICE_URL_NAME, INVOICE_VERSION, apiKey, "invoice");
  }
}

export class ReceiptEndpoint extends Endpoint {
  constructor(apiKey: string) {
    super(OTS_OWNER, RECEIPT_URL_NAME, RECEIPT_VERSION, apiKey, "receipt");
  }
}

export class PassportEndpoint extends Endpoint {
  constructor(apiKey: string) {
    super(OTS_OWNER, PASSPORT_URL_NAME, PASSPORT_VERSION, apiKey);
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
