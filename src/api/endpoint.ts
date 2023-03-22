import * as https from "https";
import * as os from "os";

import { version as sdkVersion } from "../../package.json";
import { URL } from "url";
import FormData from "form-data";
import { InputSource } from "../inputs";
import { logger } from "../logger";
import { IncomingMessage, RequestOptions } from "http";

const DEFAULT_MINDEE_API_URL = "https://api.mindee.net/v1";
const USER_AGENT = `mindee-api-nodejs@v${sdkVersion} nodejs-${
  process.version
} ${os.type().toLowerCase()}`;

export const STANDARD_API_OWNER = "mindee";
export const API_KEY_ENVVAR_NAME = "MINDEE_API_KEY";
export const API_BASE_URL_ENVVAR_NAME = "MINDEE_BASE_URL";

export interface EndpointResponse {
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
    this.urlRoot = `${this.baseUrlFromEnv()}/products/${owner}/${urlName}/v${version}`;
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
  ): Promise<EndpointResponse> {
    return this.sendFileForPrediction(input, "predict", includeWords, cropper);
  }

  /**
   * Make a request to POST a document for async prediction.
   * @param input
   * @param includeWords
   * @param cropper
   */
  predictAsyncReqPost(
    input: InputSource,
    includeWords = false,
    cropper = false
  ): Promise<EndpointResponse> {
    return this.sendFileForPrediction(
      input,
      "predict_async",
      includeWords,
      cropper
    );
  }

  /**
   *
   * @param queueId
   */
  documentQueueGet(queueId: string): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const uri = new URL(`${this.urlRoot}/document/queue/${queueId}`);
      logger.debug(`Request URI: ${uri}`);

      const options = {
        method: "GET",
        headers: this.baseHeaders,
        hostname: uri.hostname,
        path: `${uri.pathname}${uri.search}`,
      };

      const req = this.readResponse(options, resolve, reject);

      req.on("error", (err: any) => {
        reject(err);
      });
    });
  }

  /**
   * Send a file to a prediction API.
   * @param input
   * @param predictUrl
   * @param includeWords
   * @param cropper
   */
  protected sendFileForPrediction(
    input: InputSource,
    predictUrl: string,
    includeWords = false,
    cropper = false
  ): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const uri = new URL(`${this.urlRoot}/${predictUrl}`);
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
      const req = this.readResponse(options, resolve, reject);

      form.pipe(req);

      req.on("error", (err: any) => {
        reject(err);
      });
    });
  }

  protected readResponse(
    options: RequestOptions,
    resolve: (value: EndpointResponse | PromiseLike<EndpointResponse>) => void,
    reject: (reason?: any) => void
  ) {
    return https.request(options, function (res: IncomingMessage) {
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

  protected baseUrlFromEnv(): string {
    const envVarValue = process.env[API_BASE_URL_ENVVAR_NAME];
    if (envVarValue) {
      logger.debug(`Set the API base URL to ${envVarValue}`);
      return envVarValue;
    }
    return DEFAULT_MINDEE_API_URL;
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
