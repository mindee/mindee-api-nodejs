import { ApiSettingsV2 } from "./apiSettingsV2.js";
import { Dispatcher } from "undici";
import { InferenceParameters } from "@/clientV2.js";
import { ErrorResponse, InferenceResponse, JobResponse } from "@/parsing/v2/index.js";
import { sendRequestAndReadResponse, EndpointResponse } from "./apiCore.js";
import { InputSource, LocalInputSource, UrlInput } from "@/input/index.js";
import { MindeeApiV2Error, MindeeHttpErrorV2 } from "@/errors/index.js";
import { logger } from "@/logger.js";

export class MindeeApiV2 {
  settings: ApiSettingsV2;

  constructor(dispatcher: Dispatcher, apiKey?: string) {
    this.settings = new ApiSettingsV2({ dispatcher: dispatcher, apiKey: apiKey });
  }

  /**
   * Sends a file to the inference queue.
   * @param inputSource Local file loaded as an input.
   * @param params {InferenceParameters} parameters relating to the enqueueing options.
   * @category V2
   * @throws Error if the server's response contains one.
   * @returns a `Promise` containing a job response.
   */
  async reqPostInferenceEnqueue(inputSource: InputSource, params: InferenceParameters): Promise<JobResponse> {
    await inputSource.init();
    if (params.modelId === undefined || params.modelId === null || params.modelId === "") {
      throw new Error("Model ID must be provided");
    }
    const result: EndpointResponse = await this.#documentEnqueuePost(inputSource, params);
    if (result.data.error !== undefined) {
      throw new MindeeHttpErrorV2(result.data.error);
    }
    return this.#processResponse(result, JobResponse);
  }


  /**
   * Requests the job of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param inferenceId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing either the parsed result, or information on the queue.
   */
  async reqGetInference(inferenceId: string): Promise<InferenceResponse> {
    const queueResponse: EndpointResponse = await this.#inferenceResultReqGet(inferenceId, "inferences");
    return this.#processResponse(queueResponse, InferenceResponse);
  }

  /**
   * Requests the results of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param jobId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing information on the queue.
   */
  async reqGetJob(jobId: string): Promise<JobResponse> {
    const queueResponse: EndpointResponse = await this.#inferenceResultReqGet(jobId, "jobs");
    return this.#processResponse(queueResponse, JobResponse);
  }

  #processResponse<T extends JobResponse | InferenceResponse>
  (result: EndpointResponse, responseType: new (data: { [key: string]: any; }) => T): T {
    if (result.messageObj?.statusCode && (result.messageObj?.statusCode > 399 || result.messageObj?.statusCode < 200)) {
      if (result.data?.status !== null) {
        throw new MindeeHttpErrorV2(new ErrorResponse(result.data));
      }
      throw new MindeeHttpErrorV2(
        new ErrorResponse(
          {
            status: result.messageObj?.statusCode ?? -1,
            title: "Unknown Error",
            detail: result.data?.detail ?? "The server returned an Unknown error.",
            code: `${result.messageObj?.statusCode ?? -1}-000`,
          }
        )
      );
    }
    try {
      return new responseType(result.data);
    } catch (e) {
      logger.error(`Raised '${e}' Couldn't deserialize response object:\n${JSON.stringify(result.data)}`);
      throw new MindeeApiV2Error("Couldn't deserialize response object.");
    }
  }

  /**
   * Sends a document to the inference queue.
   *
   * @param inputSource Local or remote file as an input.
   * @param params {InferenceParameters} parameters relating to the enqueueing options.
   */
  async #documentEnqueuePost(
    inputSource: InputSource,
    params: InferenceParameters
  ): Promise<EndpointResponse> {
    const form = new FormData();

    form.append("model_id", params.modelId);
    if (params.rag !== undefined && params.rag !== null) {
      form.append("rag", params.rag.toString());
    }
    if (params.polygon !== undefined && params.polygon !== null) {
      form.append("polygon", params.polygon.toString().toLowerCase());
    }
    if (params.confidence !== undefined && params.confidence !== null) {
      form.append("confidence", params.confidence.toString().toLowerCase());
    }
    if (params.rawText !== undefined && params.rawText !== null) {
      form.append("raw_text", params.rawText.toString().toLowerCase());
    }
    if (params.textContext !== undefined && params.textContext !== null) {
      form.append("text_context", params.textContext);
    }
    if (params.dataSchema !== undefined && params.dataSchema !== null) {
      form.append("data_schema", params.dataSchema.toString());
    }
    if (params.webhookIds && params.webhookIds.length > 0) {
      form.append("webhook_ids", params.webhookIds.join(","));
    }
    if (inputSource instanceof LocalInputSource) {
      form.append("file", new Blob([inputSource.fileObject]), inputSource.filename);
    } else {
      form.append("url", (inputSource as UrlInput).url);
    }
    const path = "/v2/inferences/enqueue";
    const options = {
      method: "POST",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: path,
      timeout: this.settings.timeout,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }

  /**
   * Make a request to GET the status of a document in the queue.
   * @param queueId ID of either the job or the inference.
   * @param slug "jobs" or "inferences"...
   * @category Asynchronous
   * @returns a `Promise` containing either the parsed result, or information on the queue.
   */
  async #inferenceResultReqGet(queueId: string, slug: string): Promise<EndpointResponse> {
    const options = {
      method: "GET",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v2/${slug}/${queueId}`,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }
}
