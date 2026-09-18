import { ApiSettings } from "./apiSettings.js";
import { Dispatcher } from "undici";
import { BaseProductParameters } from "@/v2/index.js";
import {
  BaseSearchParameters, BaseAnnotationParameters, BaseRagDocumentUploadParameters
} from "@/v2/clientOptions/index.js";
import { FormData } from "undici";
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
import { BaseSearch } from "@/v2/search/baseSearch.js";

/**
 * Mindee V2 API handler.
 */
export class MindeeApiV2 {
  settings: ApiSettings;

  constructor(dispatcher?: Dispatcher, apiKey?: string) {
    this.settings = new ApiSettings({ dispatcher: dispatcher, apiKey: apiKey });
  }

  /**
   * Send a file to the asynchronous processing queue for inference processing.
   * @param product Product to enqueue.
   * @param inputSource Local or remote file as an input.
   * @param params {ExtractionParameters} parameters relating to the enqueueing options.
   */
  async reqPostProductEnqueue(
    product: typeof BaseProduct,
    inputSource: InputSource,
    params: BaseProductParameters
  ): Promise<JobResponse> {
    const form = this.#paramsToFormData(params.getRequestParameters());

    if (inputSource instanceof LocalInputSource) {
      form.set("file", new Blob([inputSource.fileObject]), inputSource.filename);
    } else {
      form.set("url", (inputSource as UrlInput).url);
    }
    const options: RequestOptions = {
      method: "POST",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v2/products/${product.slug}/enqueue`,
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
   * Get the status of an inference that was previously enqueued.
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
   * Get the status of an inference that was previously enqueued.
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
   * Get the result of an inference that was previously enqueued.
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
   * Get the result of an inference that was previously enqueued.
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

  /**
   * Retrieves a list of resources with the given criteria.
   * @param search Search definition class to use.
   * @param parameters Search parameters.
   * @returns a `Promise` containing the search response.
   */
  async reqGetSearch<S extends typeof BaseSearch>(
    search: S,
    parameters: BaseSearchParameters
  ): Promise<InstanceType<S["responseClass"]>> {
    const options: RequestOptions = {
      method: "GET",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v2/search/${search.slug}`,
      queryParams: parameters.getRequestParameters(),
      timeoutSecs: this.settings.timeoutSecs,
    };
    const response: BaseHttpResponse = await sendRequestAndReadResponse(this.settings.dispatcher, options);
    return this.#processResponse(response, search.responseClass) as InstanceType<S["responseClass"]>;
  }

  /**
   * Get a document's info and annotations from the RAG database.
   * @param product the product definition to use.
   * @param documentId the document id to get.
   * @returns a `Promise` containing an annotation response.
   */
  async reqGetRagAnnotation<P extends typeof BaseProduct>(
    product: P,
    documentId: string
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    const options: RequestOptions = {
      method: "GET",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v2/products/${product.slug}/rag-documents/${documentId}`,
      timeoutSecs: this.settings.timeoutSecs,
    };
    const response: BaseHttpResponse = await sendRequestAndReadResponse(this.settings.dispatcher, options);
    return this.#processResponse(
      response,
      product.annotationResponseClass
    ) as InstanceType<P["annotationResponseClass"]>;
  }

  /**
   * Add a document to the RAG database.
   * @param product the product definition to use.
   * @param parameters the parameters to use.
   * @param inputSource the file to upload.
   * @returns a `Promise` containing an annotation response.
   */
  async reqPostRagDocument<P extends typeof BaseProduct>(
    product: P,
    parameters: BaseRagDocumentUploadParameters,
    inputSource: LocalInputSource
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    const form = this.#paramsToFormData(parameters.getRequestParameters());
    form.set("file", new Blob([inputSource.fileObject]), inputSource.filename);

    const options: RequestOptions = {
      method: "POST",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v2/products/${product.slug}/rag-documents`,
      body: form,
      timeoutSecs: this.settings.timeoutSecs,
    };

    const response: BaseHttpResponse = await sendRequestAndReadResponse(this.settings.dispatcher, options);
    return this.#processResponse(
      response,
      product.annotationResponseClass
    ) as InstanceType<P["annotationResponseClass"]>;
  }

  /**
   * Update a document's annotations in the RAG database.
   * @param product the product definition to use.
   * @param parameters the parameters to use.
   * @returns a `Promise` containing an annotation response.
   */
  async reqPatchRagAnnotation<P extends typeof BaseProduct>(
    product: P,
    parameters: BaseAnnotationParameters
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    const options: RequestOptions = {
      method: "PATCH",
      headers: {
        ...this.settings.baseHeaders,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/json",
      },
      hostname: this.settings.hostname,
      path: `/v2/products/${product.slug}/rag-documents/${parameters.documentId}`,
      body: JSON.stringify(parameters.getRequestParameters()),
      timeoutSecs: this.settings.timeoutSecs,
    };
    const response: BaseHttpResponse = await sendRequestAndReadResponse(this.settings.dispatcher, options);
    return this.#processResponse(
      response,
      product.annotationResponseClass
    ) as InstanceType<P["annotationResponseClass"]>;
  }

  /**
   * Deletes a document from the RAG database.
   * @param product the product definition to use.
   * @param documentId the document's ID.
   * @returns true if the document was deleted successfully, false otherwise.
   */
  async reqDeleteRagDocument<P extends typeof BaseProduct>(
    product: P,
    documentId: string
  ): Promise<boolean> {
    const options: RequestOptions = {
      method: "DELETE",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v2/products/${product.slug}/rag-documents/${documentId}`,
      timeoutSecs: this.settings.timeoutSecs,
    };
    const response: BaseHttpResponse = await sendRequestAndReadResponse(this.settings.dispatcher, options);
    return response.messageObj?.statusCode >= 200 && response.messageObj?.statusCode < 400;
  }

  /**
   * Transforms a set of parameters into a FormData object.
   * @param params the parameters to transform.
   * @private
   */
  #paramsToFormData(params: Record<string, string>): FormData {
    const form = new FormData();
    for (const [key, value] of Object.entries(params)) {
      form.set(key, value);
    }
    return form;
  }

  #processResponse<T extends BaseResponse>(
    result: BaseHttpResponse,
    responseClass: ResponseConstructor<T>,
  ): T {
    if (
      result.messageObj?.statusCode
      && (result.messageObj?.statusCode > 399 || result.messageObj?.statusCode < 200)
    ) {
      let errorResponse: ErrorResponse;

      if (result.data?.status !== null) {
        errorResponse = new ErrorResponse(result.data);
      } else {
        errorResponse = new ErrorResponse(
          {
            status: result.messageObj?.statusCode ?? -1,
            title: "Unknown Error",
            detail: result.data?.detail ?? "The server returned an Unknown error.",
            code: `${result.messageObj?.statusCode ?? -1}-000`,
          }
        );
      }
      logger.error(errorResponse.toString());
      throw new MindeeHttpErrorV2(errorResponse);
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
