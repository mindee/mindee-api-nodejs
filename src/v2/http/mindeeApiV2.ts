import { ApiSettings } from "./apiSettings.js";
import { Dispatcher } from "undici";
import { BaseParameters } from "@/v2/index.js";
import {
  BaseResponse,
  ErrorResponse,
  ResponseConstructor,
  JobResponse,
} from "@/v2/parsing/index.js";
import {
  sendRequestAndReadResponse,
  BaseHttpResponse,
  RequestOptions
} from "@/http/apiCore.js";
import { InputSource, LocalInputSource, UrlInput } from "@/input/index.js";
import { MindeeDeserializationError, MindeeError } from "@/errors/index.js";
import { MindeeHttpErrorV2 } from "./errors.js";
import { logger } from "@/logger.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Mindee V2 API handler.
 */
export class MindeeApiV2 {
  settings: ApiSettings;

  constructor(dispatcher?: Dispatcher, apiKey?: string) {
    this.settings = new ApiSettings({ dispatcher: dispatcher, apiKey: apiKey });
  }

  /**
   * Sends a document to the inference queue.
   * @param product Product to enqueue.
   * @param inputSource Local or remote file as an input.
   * @param params {ExtractionParameters} parameters relating to the enqueueing options.
   */
  async reqPostProductEnqueue(
    product: typeof BaseProduct,
    inputSource: InputSource,
    params: BaseParameters
  ): Promise<JobResponse> {
    const form = params.getFormData();
    if (inputSource instanceof LocalInputSource) {
      form.set("file", new Blob([inputSource.fileObject]), inputSource.filename);
    } else {
      form.set("url", (inputSource as UrlInput).url);
    }
    const path = `/v2/products/${product.slug}/enqueue`;
    const options: RequestOptions = {
      method: "POST",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: path,
      body: form,
      timeoutSecs: this.settings.timeoutSecs,
    };
    const result: BaseHttpResponse = await sendRequestAndReadResponse(this.settings.dispatcher, options);

    if (result.data.error !== undefined) {
      throw new MindeeHttpErrorV2(result.data.error);
    }
    return this.#processResponse(result, JobResponse);
  }

  /**
   * Get the specified Job by its ID.
   * Throws an error if the server's response contains an error.
   * @param jobId The Job ID as returned by the enqueue request.
   * @returns a `Promise` containing the job response.
   */
  async reqGetJobById(jobId: string): Promise<JobResponse> {
    return this.reqGetJobByUrl(
      `https://${this.settings.hostname}/v2/jobs/${jobId}`
    );
  }

  /**
   * Get the specified Job from a polling URL.
   * Throws an error if the server's response contains an error.
   * @param pollingUrl The polling URL as returned by a Job's pollingUrl property.
   * @returns a `Promise` containing the job response.
   */
  async reqGetJobByUrl(pollingUrl: string): Promise<JobResponse> {
    if (!pollingUrl.startsWith("https://")) {
      throw new MindeeError(`Invalid URL: ${pollingUrl}`);
    }
    const options: RequestOptions = {
      method: "GET",
      headers: this.settings.baseHeaders,
      timeoutSecs: this.settings.timeoutSecs,
    };
    const response: BaseHttpResponse = await sendRequestAndReadResponse(this.settings.dispatcher, options, pollingUrl);
    return this.#processResponse(response, JobResponse);
  }

  /**
   * Get the result of a queued document from the API.
   * Throws an error if the server's response contains an error.
   * @param product
   * @param inferenceId The inference ID for the result.
   * @returns a `Promise` containing the parsed result.
   */
  async reqGetProductResultById<P extends typeof BaseProduct>(
    product: P,
    inferenceId: string,
  ): Promise<InstanceType<P["responseClass"]>> {
    return this.reqGetProductResultByUrl(
      product,
      `https://${this.settings.hostname}/v2/products/${product.slug}/results/${inferenceId}`
    );
  }

  /**
   * Get the result of a queued document from the API.
   * Throws an error if the server's response contains an error.
   * @param product
   * @param url The URL as returned by a Job's resultUrl property.
   * @returns a `Promise` containing the parsed result.
   */
  async reqGetProductResultByUrl<P extends typeof BaseProduct>(
    product: P,
    url: string,
  ): Promise<InstanceType<P["responseClass"]>> {
    const options: RequestOptions = {
      method: "GET",
      headers: this.settings.baseHeaders,
      timeoutSecs: this.settings.timeoutSecs,
    };
    if (!url.startsWith("https://")) {
      throw new MindeeError(`Invalid URL: ${url}`);
    }
    const response: BaseHttpResponse = await sendRequestAndReadResponse(this.settings.dispatcher, options, url);

    return this.#processResponse(response, product.responseClass) as InstanceType<P["responseClass"]>;
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
}
