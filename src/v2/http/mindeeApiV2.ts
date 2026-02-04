import { ApiSettingsV2 } from "./apiSettingsV2.js";
import { Dispatcher } from "undici";
import { ExtractionParameters, SplitParameters } from "@/v2/client/index.js";
import {
  BaseResponse,
  ErrorResponse,
  ResponseConstructor,
  InferenceResponseConstructor,
  JobResponse,
  CropResponse,
  OcrResponse,
  SplitResponse,
  ExtractionResponse,
  BaseInference, ExtractionInference,
} from "@/v2/parsing/index.js";
import { sendRequestAndReadResponse, BaseHttpResponse } from "@/http/apiCore.js";
import { InputSource, LocalInputSource, UrlInput } from "@/input/index.js";
import { MindeeDeserializationError } from "@/errors/index.js";
import { MindeeHttpErrorV2 } from "./errors.js";
import { logger } from "@/logger.js";
import {
  BaseInferenceResponse,
  CropInference,
  OcrInference,
  SplitInference
} from "@/v2/parsing/result/index.js";


export class MindeeApiV2 {
  settings: ApiSettingsV2;

  constructor(dispatcher?: Dispatcher, apiKey?: string) {
    this.settings = new ApiSettingsV2({ dispatcher: dispatcher, apiKey: apiKey });
  }

  #getSlugFromInference<T extends BaseInference>(
    responseClass: InferenceResponseConstructor<T>
  ): string {
    switch (responseClass as any) {
    case CropInference:
      return "utilities/crop";
    case OcrInference:
      return "utilities/ocr";
    case SplitInference:
      return "utilities/split";
    case ExtractionInference:
      return "inferences";
    default:
      throw new Error("Unsupported response class.");
    }
  }

  #getResponseClassFromInference<T extends BaseInference>(
    inferenceClass: InferenceResponseConstructor<T>
  ): ResponseConstructor<BaseInferenceResponse<T>> {
    switch (inferenceClass as any) {
    case CropInference:
      return CropResponse as any;
    case OcrInference:
      return OcrResponse as any;
    case SplitInference:
      return SplitResponse as any;
    case ExtractionInference:
      return ExtractionResponse as any;
    default:
      throw new Error("Unsupported inference class.");
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
  async reqPostInferenceEnqueue<T extends BaseInference>(
    responseClass: InferenceResponseConstructor<T>,
    inputSource: InputSource,
    params: ExtractionParameters | SplitParameters
  ): Promise<JobResponse> {
    await inputSource.init();
    const result: BaseHttpResponse = await this.#inferenceEnqueuePost(
      inputSource, params
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
  async reqGetInference<T extends BaseInference>(
    responseClass: InferenceResponseConstructor<T>,
    inferenceId: string,
  ): Promise<BaseInferenceResponse<T>> {
    const slug = this.#getSlugFromInference(responseClass);
    const queueResponse: BaseHttpResponse = await this.#inferenceResultReqGet(inferenceId, slug);
    const actualResponseClass = this.#getResponseClassFromInference(responseClass);
    return this.#processResponse(queueResponse, actualResponseClass) as BaseInferenceResponse<T>;
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
   * @param params {ExtractionParameters} parameters relating to the enqueueing options.
   */
  async #inferenceEnqueuePost(
    inputSource: InputSource,
    params: ExtractionParameters | SplitParameters
  ): Promise<BaseHttpResponse> {
    const form = params.getFormData();
    if (inputSource instanceof LocalInputSource) {
      form.set("file", new Blob([inputSource.fileObject]), inputSource.filename);
    } else {
      form.set("url", (inputSource as UrlInput).url);
    }
    const path = `/v2/${params.slug}/enqueue`;
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
