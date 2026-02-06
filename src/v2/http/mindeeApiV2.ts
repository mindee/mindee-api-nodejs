import { ApiSettingsV2 } from "./apiSettingsV2.js";
import { Dispatcher } from "undici";
import { BaseParameters } from "@/v2/client/index.js";
import {
  BaseResponse,
  ErrorResponse,
  ResponseConstructor,
  JobResponse,
  BaseInference,
} from "@/v2/parsing/index.js";
import { sendRequestAndReadResponse, BaseHttpResponse } from "@/http/apiCore.js";
import { InputSource, LocalInputSource, UrlInput } from "@/input/index.js";
import { MindeeDeserializationError } from "@/errors/index.js";
import { MindeeHttpErrorV2 } from "./errors.js";
import { logger } from "@/logger.js";
import {
  BaseInferenceResponse,
} from "@/v2/parsing/result/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";


export class MindeeApiV2 {
  settings: ApiSettingsV2;

  constructor(dispatcher?: Dispatcher, apiKey?: string) {
    this.settings = new ApiSettingsV2({ dispatcher: dispatcher, apiKey: apiKey });
  }

  /**
   * Sends a file to the extraction inference queue.
   * @param inputSource Local file loaded as an input.
   * @param params {ExtractionParameters} parameters relating to the enqueueing options.
   * @category V2
   * @throws Error if the server's response contains one.
   * @returns a `Promise` containing a job response.
   */
  async reqPostProductEnqueue(
    product: typeof BaseProduct,
    inputSource: InputSource,
    params: BaseParameters
  ): Promise<JobResponse> {
    await inputSource.init();
    const result: BaseHttpResponse = await this.#productEnqueuePost(
      product, inputSource, params
    );
    if (result.data.error !== undefined) {
      throw new MindeeHttpErrorV2(result.data.error);
    }
    return this.#processResponse(result, JobResponse);
  }

  /**
   * Requests the job of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param product
   * @param inferenceId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing either the parsed result, or information on the queue.
   */
  async reqGetResult<T extends BaseInference>(
    product: typeof BaseProduct,
    inferenceId: string,
  ): Promise<BaseInferenceResponse<T>> {
    const queueResponse: BaseHttpResponse = await this.#inferenceResultReqGet(
      inferenceId, product.getResultSlug
    );
    return this.#processResponse(queueResponse, product.response) as BaseInferenceResponse<T>;
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
  async #productEnqueuePost(
    product: typeof BaseProduct,
    inputSource: InputSource,
    params: BaseParameters
  ): Promise<BaseHttpResponse> {
    const form = params.getFormData();
    if (inputSource instanceof LocalInputSource) {
      form.set("file", new Blob([inputSource.fileObject]), inputSource.filename);
    } else {
      form.set("url", (inputSource as UrlInput).url);
    }
    const path = `/v2/${product.enqueueSlug}/enqueue`;
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
