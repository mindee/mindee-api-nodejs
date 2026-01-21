import { ApiSettingsV2 } from "./apiSettingsV2.js";
import { Dispatcher } from "undici";
import { ExtractionParameters, UtilityParameters } from "@/v2/client/index.js";
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

  #getSlugFromResponse<T extends BaseResponse>(
    responseClass: ResponseConstructor<T>
  ): string {
    switch (responseClass as any) {
    case CropResponse:
      return "utilities/crop";
    case OcrResponse:
      return "utilities/ocr";
    case SplitResponse:
      return "utilities/split";
    case ExtractionResponse:
      return "inferences";
    default:
      throw new Error("Unsupported response class.");
    }
  }

  /**
   * Sends a file to the extraction inference queue.
   * @param responseClass Class of the inference to enqueue.
   * @param inputSource Local file loaded as an input.
   * @param params {ExtractionParameters} parameters relating to the enqueueing options.
   * @category V2
   * @throws Error if the server's response contains one.
   * @returns a `Promise` containing a job response.
   */
  async reqPostInferenceEnqueue<T extends BaseInferenceResponse>(
    responseClass: ResponseConstructor<T>,
    inputSource: InputSource,
    params: ExtractionParameters | UtilityParameters
  ): Promise<JobResponse> {
    await inputSource.init();
    const slug = this.#getSlugFromResponse(responseClass);
    const result: BaseHttpResponse = await this.#inferenceEnqueuePost(
      inputSource, slug, params
    );
    if (result.data.error !== undefined) {
      throw new MindeeHttpErrorV2(result.data.error);
    }
    return this.#processResponse(result, JobResponse);
  }

  /**
   * Requests the job of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param responseClass
   * @param inferenceId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing either the parsed result, or information on the queue.
   */
  async reqGetInference<T extends BaseInferenceResponse>(
    responseClass: ResponseConstructor<T>,
    inferenceId: string,
  ): Promise<T> {
    const slug = this.#getSlugFromResponse(responseClass);
    const queueResponse: BaseHttpResponse = await this.#inferenceResultReqGet(inferenceId, slug);
    return this.#processResponse(queueResponse, responseClass);
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
    responseClass: ResponseConstructor<T>,
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
      return new responseClass(result.data);
    } catch (e) {
      logger.error(`Raised '${e}' Couldn't deserialize response object:\n${JSON.stringify(result.data)}`);
      throw new MindeeDeserializationError("Couldn't deserialize response object.");
    }
  }

  /**
   * Sends a document to the inference queue.
   *
   * @param inputSource Local or remote file as an input.
   * @param slug Slug of the inference to enqueue.
   * @param params {ExtractionParameters} parameters relating to the enqueueing options.
   */
  async #inferenceEnqueuePost(
    inputSource: InputSource,
    slug: string,
    params: ExtractionParameters | UtilityParameters
  ): Promise<BaseHttpResponse> {
    const form = params.getFormData();
    if (inputSource instanceof LocalInputSource) {
      form.set("file", new Blob([inputSource.fileObject]), inputSource.filename);
    } else {
      form.set("url", (inputSource as UrlInput).url);
    }
    const path = `/v2/${slug}/enqueue`;
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
