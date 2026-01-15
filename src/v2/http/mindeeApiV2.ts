import { ApiSettingsV2 } from "./apiSettingsV2.js";
import { Dispatcher } from "undici";
import { InferenceParameters, UtilityParameters } from "@/v2/client/index.js";
import {
  BaseResponse,
  ErrorResponse,
  ResponseConstructor,
  JobResponse,
  CropResponse,
  OcrResponse,
  SplitResponse, ExtractionResponse, BaseInferenceResponse,
} from "@/v2/parsing/index.js";
import { sendRequestAndReadResponse, BaseHttpResponse } from "@/http/apiCore.js";
import { InputSource, LocalInputSource, UrlInput } from "@/input/index.js";
import { MindeeDeserializationError } from "@/errors/index.js";
import { MindeeHttpErrorV2 } from "./errors.js";
import { logger } from "@/logger.js";

export class MindeeApiV2 {
  settings: ApiSettingsV2;

  constructor(dispatcher?: Dispatcher, apiKey?: string) {
    this.settings = new ApiSettingsV2({ dispatcher: dispatcher, apiKey: apiKey });
  }

  /**
   * Sends a file to the extraction inference queue.
   * @param inputSource Local file loaded as an input.
   * @param params {InferenceParameters} parameters relating to the enqueueing options.
   * @category V2
   * @throws Error if the server's response contains one.
   * @returns a `Promise` containing a job response.
   */
  async reqPostInferenceEnqueue(
    inputSource: InputSource, params: InferenceParameters
  ): Promise<JobResponse> {
    await inputSource.init();
    const result: BaseHttpResponse = await this.#inferenceEnqueuePost(inputSource, params);
    if (result.data.error !== undefined) {
      throw new MindeeHttpErrorV2(result.data.error);
    }
    return this.#processResponse(result, JobResponse);
  }

  /**
   * Sends a file to the utility inference queue.
   * @param inputSource Local file loaded as an input.
   * @param params {UtilityParameters} parameters relating to the enqueueing options.
   * @category V2
   * @throws Error if the server's response contains one.
   * @returns a `Promise` containing a job response.
   */
  async reqPostUtilityEnqueue(
    inputSource: InputSource, params: UtilityParameters
  ): Promise<JobResponse> {
    await inputSource.init();
    const result: BaseHttpResponse = await this.#utilityEnqueuePost(inputSource, "crop", params);
    if (result.data.error !== undefined) {
      throw new MindeeHttpErrorV2(result.data.error);
    }
    return this.#processResponse(result, JobResponse);
  }

  /**
   * Requests the job of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param responseType
   * @param inferenceId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing either the parsed result, or information on the queue.
   */
  async reqGetInference<T extends BaseInferenceResponse>(
    responseType: ResponseConstructor<T>,
    inferenceId: string,
  ): Promise<T> {
    let slug: string;
    // this is disgusting, look into a more elegant way of linking the response type to the slug
    switch (responseType as any) {
    case CropResponse:
      slug = "utilities/crop";
      break;
    case OcrResponse:
      slug = "utilities/ocr";
      break;
    case SplitResponse:
      slug = "utilities/split";
      break;
    case ExtractionResponse:
      slug = "inferences";
      break;
    default:
      slug = "inferences";
      break;
    }
    const queueResponse: BaseHttpResponse = await this.#inferenceResultReqGet(inferenceId, slug);
    return this.#processResponse(queueResponse, responseType);
  }

  /**
   * Requests the results of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param jobId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing information on the queue.
   */
  async reqGetJob(jobId: string): Promise<JobResponse> {
    const queueResponse: BaseHttpResponse = await this.#inferenceResultReqGet(jobId, "jobs");
    return this.#processResponse(queueResponse, JobResponse);
  }

  #processResponse<T extends BaseResponse>(
    result: BaseHttpResponse,
    responseType: ResponseConstructor<T>,
  ): T {
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
      throw new MindeeDeserializationError("Couldn't deserialize response object.");
    }
  }

  /**
   * Sends a document to the inference queue.
   *
   * @param inputSource Local or remote file as an input.
   * @param slug Slug of the utility to enqueue.
   * @param params {InferenceParameters} parameters relating to the enqueueing options.
   */
  async #utilityEnqueuePost(
    inputSource: InputSource,
    slug: string,
    params: UtilityParameters
  ): Promise<BaseHttpResponse> {
    const form = new FormData();

    form.set("model_id", params.modelId);
    if (params.webhookIds && params.webhookIds.length > 0) {
      form.set("webhook_ids", params.webhookIds.join(","));
    }
    if (inputSource instanceof LocalInputSource) {
      form.set("file", new Blob([inputSource.fileObject]), inputSource.filename);
    } else {
      form.set("url", (inputSource as UrlInput).url);
    }
    const path = `/v2/utilities/${slug}/enqueue`;
    const options = {
      method: "POST",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: path,
      body: form,
      timeout: this.settings.timeout,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }


  /**
   * Sends a document to the inference queue.
   *
   * @param inputSource Local or remote file as an input.
   * @param params {InferenceParameters} parameters relating to the enqueueing options.
   */
  async #inferenceEnqueuePost(
    inputSource: InputSource,
    params: InferenceParameters
  ): Promise<BaseHttpResponse> {
    const form = new FormData();

    form.set("model_id", params.modelId);
    if (params.rag !== undefined && params.rag !== null) {
      form.set("rag", params.rag.toString());
    }
    if (params.polygon !== undefined && params.polygon !== null) {
      form.set("polygon", params.polygon.toString().toLowerCase());
    }
    if (params.confidence !== undefined && params.confidence !== null) {
      form.set("confidence", params.confidence.toString().toLowerCase());
    }
    if (params.rawText !== undefined && params.rawText !== null) {
      form.set("raw_text", params.rawText.toString().toLowerCase());
    }
    if (params.textContext !== undefined && params.textContext !== null) {
      form.set("text_context", params.textContext);
    }
    if (params.dataSchema !== undefined && params.dataSchema !== null) {
      form.set("data_schema", params.dataSchema.toString());
    }
    if (params.webhookIds && params.webhookIds.length > 0) {
      form.set("webhook_ids", params.webhookIds.join(","));
    }
    if (inputSource instanceof LocalInputSource) {
      form.set("file", new Blob([inputSource.fileObject]), inputSource.filename);
    } else {
      form.set("url", (inputSource as UrlInput).url);
    }
    const path = "/v2/inferences/enqueue";
    const options = {
      method: "POST",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: path,
      body: form,
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
  async #inferenceResultReqGet(queueId: string, slug: string): Promise<BaseHttpResponse> {
    const options = {
      method: "GET",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v2/${slug}/${queueId}`,
      timeout: this.settings.timeout,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }
}
