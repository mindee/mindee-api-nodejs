import * as https from "https";
import * as os from "os";

import { version as sdkVersion } from "../../package.json";
import { URLSearchParams } from "url";
import FormData from "form-data";
import { InputSource } from "../inputs";
import { logger } from "../logger";
import { IncomingMessage, RequestOptions, ClientRequest } from "http";

const DEFAULT_MINDEE_API_HOST = "api.mindee.net";
const USER_AGENT = `mindee-api-nodejs@v${sdkVersion} nodejs-${
  process.version
} ${os.type().toLowerCase()}`;

export const STANDARD_API_OWNER = "mindee";
export const API_KEY_ENVVAR_NAME = "MINDEE_API_KEY";
export const API_HOST_ENVVAR_NAME = "MINDEE_API_HOST";

export interface EndpointResponse {
  messageObj: IncomingMessage;
  data: { [key: string]: any };
}

export class Endpoint {
  apiKey: string;
  urlName: string;
  owner: string;
  version: string;
  hostname: string;
  urlRoot: string;
  private readonly baseHeaders: { [key: string]: string };

  constructor(owner: string, urlName: string, version: string, apiKey: string) {
    this.owner = owner;
    this.urlName = urlName;
    this.version = version;
    this.apiKey = apiKey || this.apiKeyFromEnv();
    this.hostname = this.hostnameFromEnv();
    this.urlRoot = `/v1/products/${owner}/${urlName}/v${version}`;
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
   * Make a request to GET the status of a document in the queue.
   * @param queueId
   */
  documentQueueReqGet(queueId: string): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        headers: this.baseHeaders,
        hostname: this.hostname,
        path: `${this.urlRoot}/documents/queue/${queueId}`,
      };
      const req = this.readResponse(options, resolve, reject);
      // potential ECONNRESET if we don't end the request.
      req.end();
    });
  }

  /**
   * Make a request to GET a document.
   * @param documentId
   */
  documentGetReq(documentId: string): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        headers: this.baseHeaders,
        hostname: this.hostname,
        path: `${this.urlRoot}/documents/${documentId}`,
      };
      const req = this.readResponse(options, resolve, reject);
      // potential ECONNRESET if we don't end the request.
      req.end();
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
      const searchParams = new URLSearchParams();
      if (cropper) {
        searchParams.append("cropper", "true");
      }

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

      let path = `${this.urlRoot}/${predictUrl}`;
      if (searchParams.keys.length > 0) {
        path += `?${searchParams}`;
      }
      const options: RequestOptions = {
        method: "POST",
        headers: headers,
        hostname: this.hostname,
        path: path,
      };
      const req = this.readResponse(options, resolve, reject);
      form.pipe(req);
      // potential ECONNRESET if we don't end the request.
      req.end();
    });
  }

  protected readResponse(
    options: RequestOptions,
    resolve: (value: EndpointResponse | PromiseLike<EndpointResponse>) => void,
    reject: (reason?: any) => void
  ): ClientRequest {
    logger.debug(
      `${options.method}: https://${options.hostname}${options.path}`
    );

    const req = https.request(options, function (res: IncomingMessage) {
      // when the encoding is set, data chunks will be strings
      res.setEncoding("utf-8");

      let responseBody = "";
      res.on("data", function (chunk: string) {
        logger.debug("receiving data ...");
        responseBody += chunk;
      });
      res.on("end", function () {
        // handle empty responses from server, for example in the case of redirects
        if (!responseBody) {
          responseBody = "{}";
        }
        try {
          resolve({
            messageObj: res,
            data: JSON.parse(responseBody),
          });
        } catch (error) {
          logger.debug(responseBody);
          reject(error);
        }
      });
    });
    req.on("error", (err: any) => {
      reject(err);
    });
    return req;
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
