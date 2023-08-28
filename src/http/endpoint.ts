import { request, RequestOptions } from "https";

import { URLSearchParams } from "url";
import FormData from "form-data";
import { InputSource } from "../input";
import { logger } from "../logger";
import { IncomingMessage, ClientRequest } from "http";
import { PageOptions } from "../input";
import { LocalInputSource } from "../input/base";
import { handleError } from "./error";
import { MindeeApi } from "./mindeeApi";

export interface EndpointResponse {
  messageObj: IncomingMessage;
  data: { [key: string]: any };
}

export class Endpoint {
  urlName: string;
  owner: string;
  version: string;
  urlRoot: string;
  settings: MindeeApi;

  constructor(
    urlName: string,
    owner: string,
    version: string,
    settings: MindeeApi
  ) {
    this.owner = owner;
    this.urlName = urlName;
    this.version = version;
    this.settings = settings;
    this.urlRoot = `/v1/products/${owner}/${urlName}/v${version}`;
  }

  async predict(params: {
    inputDoc: InputSource;
    includeWords: boolean;
    pageOptions?: PageOptions;
    cropper: boolean;
  }): Promise<EndpointResponse> {
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await this.#cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.#predictReqPost(
      params.inputDoc,
      params.includeWords,
      params.cropper
    );
    const statusCode = response.messageObj.statusCode;
    if (statusCode === undefined || statusCode >= 400) {
      handleError(this.urlName, response, statusCode);
    }

    return response;
  }

  async predictAsync(params: {
    inputDoc: InputSource;
    includeWords: boolean;
    pageOptions?: PageOptions;
    cropper: boolean;
  }): Promise<EndpointResponse> {
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await this.#cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.#predictAsyncReqPost(
      params.inputDoc,
      params.includeWords,
      params.cropper
    );
    const statusCode = response.messageObj.statusCode;
    if (statusCode === undefined || statusCode >= 400) {
      handleError(this.urlName, response, statusCode);
    }
    return response;
  }

  async getQueuedDocument(queueId: string): Promise<EndpointResponse> {
    const queueResponse = await this.#documentQueueReqGet(queueId);
    const queueStatusCode = queueResponse.messageObj.statusCode;
    if (
      queueStatusCode === undefined ||
      queueStatusCode < 200 ||
      queueStatusCode > 400
    ) {
      handleError(this.urlName, queueResponse);
    }
    if (
      queueStatusCode === 302 &&
      queueResponse.messageObj.headers.location !== undefined
    ) {
      const docId = queueResponse.messageObj.headers.location.split("/").pop();
      if (docId !== undefined) {
        return await this.#documentGetReq(docId);
      }
    }
    return queueResponse;
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
      if (input instanceof LocalInputSource && input.fileObject instanceof Buffer) {
        form.append("document", input.fileObject, {
          filename: input.filename,
        });
      } else {
        form.append("document", input.fileObject);
      }

      if (includeWords) {
        form.append("include_mvision", "true");
      }
      const headers = { ...this.settings.baseHeaders, ...form.getHeaders() };

      let path = `${this.urlRoot}/${predictUrl}`;
      if (searchParams.keys.length > 0) {
        path += `?${searchParams}`;
      }
      const options: RequestOptions = {
        method: "POST",
        headers: headers,
        hostname: this.settings.hostname,
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

    const req = request(options, function (res: IncomingMessage) {
      // when the encoding is set, data chunks will be strings
      res.setEncoding("utf-8");

      let responseBody = "";
      res.on("data", function (chunk: string) {
        logger.debug("Receiving data ...");
        responseBody += chunk;
      });
      res.on("end", function () {
        logger.debug("Parsing the response ...");
        // handle empty responses from server, for example in the case of redirects
        if (!responseBody) {
          responseBody = "{}";
        }
        try {
          const parsedResponse = JSON.parse(responseBody);
          try {
            resolve({
              messageObj: res,
              data: parsedResponse,
            });
          } catch (error) {
            logger.error("Could not construct the return object.");
            reject(error);
          }
        } catch (error) {
          logger.error("Could not parse the return as JSON.");
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

  async #cutDocPages(inputDoc: InputSource, pageOptions: PageOptions) {
    if (inputDoc instanceof LocalInputSource && inputDoc.isPdf()) {
      await inputDoc.cutPdf(pageOptions);
    }
  }

  /**
   * Make a request to POST a document for prediction.
   * @param input
   * @param includeWords
   * @param cropper
   */
  #predictReqPost(
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
  #predictAsyncReqPost(
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
  #documentQueueReqGet(queueId: string): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        headers: this.settings.baseHeaders,
        hostname: this.settings.hostname,
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
  #documentGetReq(documentId: string): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        headers: this.settings.baseHeaders,
        hostname: this.settings.hostname,
        path: `${this.urlRoot}/documents/${documentId}`,
      };
      const req = this.readResponse(options, resolve, reject);
      // potential ECONNRESET if we don't end the request.
      req.end();
    });
  }
}
