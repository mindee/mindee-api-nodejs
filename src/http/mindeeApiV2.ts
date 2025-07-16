import { ApiSettingsV2 } from "./apiSettingsV2";
import { InferencePredictOptions } from "../clientV2";
import { InferenceResponse, JobResponse } from "../parsing/v2";
import FormData from "form-data";
import { RequestOptions } from "https";
import { BaseEndpoint, EndpointResponse } from "./baseEndpoint";
import { LocalInputSource } from "../input";
import { MindeeHttpErrorV2 } from "../errors/mindeeError";
import { logger } from "../logger";

export class MindeeApiV2 {
  settings: ApiSettingsV2;

  constructor(apiKey?: string) {
    this.settings = new ApiSettingsV2({ apiKey: apiKey });
  }

  /**
   * Sends a file to the inference queue.
   * @param inputDoc Local file loaded as an input.
   * @param params {InferencePredictOptions} parameters relating to the enqueueing options.
   * @category V2
   * @throws Error if the server's response contains one.
   * @returns a `Promise` containing a job response.
   */
  async predictAsyncReqPost(inputDoc: LocalInputSource, params: InferencePredictOptions): Promise<JobResponse> {
    await inputDoc.init();
    if (params.pageOptions !== undefined) {
      await BaseEndpoint.cutDocPages(inputDoc, params.pageOptions);
    }
    if (params.modelId === undefined || params.modelId === null || params.modelId === "") {
      throw new Error("Model ID must be provided");
    }
    const result: EndpointResponse = await this.#documentEnqueuePost(inputDoc, params);
    if (result.data.error?.code !== undefined) {
      throw new MindeeHttpErrorV2(
        result.data.error.code,
        result.data.error.message ?? "Unknown error."
      );
    }
    return this.#processResponse(result, JobResponse);
  }


  /**
   * Requests the results of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param jobId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing either the parsed result, or information on the queue.
   */
  async getQueuedDocument(jobId: string): Promise<JobResponse | InferenceResponse> {
    const queueResponse: EndpointResponse = await this.#documentQueueReqGet(jobId);
    const queueStatusCode = queueResponse.messageObj.statusCode;
    if (
      queueStatusCode === 302 &&
      queueResponse.messageObj.headers.location !== undefined
    ) {
      const docId = queueResponse.messageObj.headers.location.split("/").pop();
      if (docId !== undefined) {
        return this.#processResponse(await this.#documentGetReq(docId), InferenceResponse);
      }
    }
    return this.#processResponse(queueResponse, JobResponse);
  }

  #processResponse<T extends JobResponse | InferenceResponse>
  (result: EndpointResponse, responseType: new (data: { [key: string]: any; }) => T): T {
    if (result.messageObj?.statusCode && (result.messageObj?.statusCode > 399 || result.messageObj?.statusCode < 200)) {
      if (result.data?.status !== null) {
        throw new MindeeHttpErrorV2(
          result.data?.status, result.data?.detail ?? "Unknown error."
        );
      }
      throw new MindeeHttpErrorV2(
        result.messageObj?.statusCode ?? -1, result.data?.statusMessage ?? "Unknown error."
      );
    }
    try {
      return new responseType(result.data);
    } catch (e) {
      logger.error(`Raised '${e}' Couldn't deserialize response object:\n${JSON.stringify(result.data)}`);
      throw e;
      // throw new MindeeApiV2Error("Couldn't deserialize response object.");
    }
  }

  /**
   * Sends a document to the inference queue.
   *
   * @param inputDoc Local file loaded as an input.
   * @param params {InferencePredictOptions} parameters relating to the enqueueing options.
   */
  #documentEnqueuePost(inputDoc: LocalInputSource, params: InferencePredictOptions): Promise<EndpointResponse> {
    const form = new FormData();

    form.append("model_id", params.modelId);
    if (params.rag) {
      form.append("rag", "true");
    }
    if (params.webhookIds && params.webhookIds.length > 0) {
      form.append("webhook_ids", params.webhookIds.join(","));
    }
    form.append("file", inputDoc.fileObject, {
      filename: inputDoc.filename,
    });
    const path = "/v2/inferences/enqueue";
    const headers = { ...this.settings.baseHeaders, ...form.getHeaders() };
    const options: RequestOptions = {
      method: "POST",
      headers: headers,
      hostname: this.settings.hostname,
      path: path,
      timeout: this.settings.timeout,
    };
    return new Promise((resolve, reject) => {
      const req = BaseEndpoint.readResponse(options, resolve, reject);
      form.pipe(req);
      // potential ECONNRESET if we don't end the request.
      req.end();
    });
  }

  /**
   * Make a request to GET a document.
   * @param queueId
   */
  #documentGetReq(queueId: string): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        headers: this.settings.baseHeaders,
        hostname: this.settings.hostname,
        path: `/v2/inferences/${queueId}`,
      };
      const req = BaseEndpoint.readResponse(options, resolve, reject);
      // potential ECONNRESET if we don't end the request.
      req.end();
    });
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
        path: `/v2/jobs/${queueId}`,
      };
      const req = BaseEndpoint.readResponse(options, resolve, reject);
      // potential ECONNRESET if we don't end the request.
      req.end();
    });
  }
}
