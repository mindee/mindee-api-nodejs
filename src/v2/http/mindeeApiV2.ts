import { ApiSettings } from "./apiSettings.js";
import { Dispatcher } from "undici";
import { BaseParameters } from "@/v2/client/index.js";
import {
  BaseResponse,
  ErrorResponse,
  ResponseConstructor,
  JobResponse,
} from "@/v2/parsing/index.js";
import { sendRequestAndReadResponse, BaseHttpResponse } from "@/http/apiCore.js";
import { InputSource, LocalInputSource, UrlInput } from "@/input/index.js";
import { MindeeDeserializationError } from "@/errors/index.js";
import { MindeeHttpErrorV2 } from "./errors.js";
import { logger } from "@/logger.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";


export class MindeeApiV2 {
  settings: ApiSettings;

  constructor(dispatcher?: Dispatcher, apiKey?: string) {
    this.settings = new ApiSettings({ dispatcher: dispatcher, apiKey: apiKey });
  }

  /**
   * Sends a file to the extraction inference queue.
   * @param product product to enqueue.
   * @param inputSource Local file loaded as an input.
   * @param params {ExtractionParameters} parameters relating to the enqueueing options.
   * @category V2
   * @throws Error if the server's response contains one.
   * @returns a `Promise` containing a job response.
   */
  async enqueueProduct(
    product: typeof BaseProduct,
    inputSource: InputSource,
    params: BaseParameters
  ): Promise<JobResponse> {
    await inputSource.init();
    const result: BaseHttpResponse = await this.#reqPostProductEnqueue(
      product, inputSource, params
    );
    if (result.data.error !== undefined) {
      throw new MindeeHttpErrorV2(result.data.error);
    }
    return this.#processResponse(result, JobResponse);
  }

  /**
   * Requests the results of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param jobId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing information on the queue.
   */
  async getJob(jobId: string): Promise<JobResponse> {
    const response = await this.#reqGetJob(jobId);
    return this.#processResponse(response, JobResponse);
  }

  /**
   * Requests the job of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param product
   * @param inferenceId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing either the parsed result, or information on the queue.
   */
  async getProductResult<P extends typeof BaseProduct>(
    product: P,
    inferenceId: string,
  ): Promise<InstanceType<P["responseClass"]>> {
    const queueResponse: BaseHttpResponse = await this.#reqGetProductResult(
      inferenceId, product.slug
    );
    return this.#processResponse(queueResponse, product.responseClass) as InstanceType<P["responseClass"]>;
  }

  #processResponse<T extends BaseResponse>(
    result: BaseHttpResponse,
    responseClass: ResponseConstructor<T>,
  ): T {
    if (
      result.messageObj?.statusCode
      && (result.messageObj?.statusCode > 399 || result.messageObj?.statusCode < 200)
    ) {
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
      logger.error(
        `Raised '${e}' Couldn't deserialize response object:\n${JSON.stringify(result.data)}`
      );
      throw new MindeeDeserializationError("Couldn't deserialize response object.");
    }
  }

  /**
   * Sends a document to the inference queue.
   *
   * @param product Product to enqueue.
   * @param inputSource Local or remote file as an input.
   * @param params {ExtractionParameters} parameters relating to the enqueueing options.
   */
  async #reqPostProductEnqueue(
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
    const path = `/v2/products/${product.slug}/enqueue`;
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

  async #reqGetJob(jobId: string): Promise<BaseHttpResponse> {
    const options = {
      method: "GET",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v2/jobs/${jobId}`,
      timeout: this.settings.timeout,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }

  /**
   * Make a request to GET the status of a document in the queue.
   * @param inferenceId ID of the inference.
   * @param slug "jobs" or "inferences"...
   * @category Asynchronous
   * @returns a `Promise` containing either the parsed result, or information on the queue.
   */
  async #reqGetProductResult(inferenceId: string, slug: string): Promise<BaseHttpResponse> {
    const options = {
      method: "GET",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v2/products/${slug}/results/${inferenceId}`,
      timeout: this.settings.timeout,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }
}
