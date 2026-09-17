import { setTimeout } from "node:timers/promises";
import { Dispatcher } from "undici";
import { InputSource } from "@/input/index.js";
import { MindeeError } from "@/errors/index.js";
import { errorHandler } from "@/errors/handler.js";
import { LOG_LEVELS, logger } from "@/logger.js";
import { ErrorResponse, JobResponse } from "./parsing/index.js";
import { SearchResponse } from "./parsing/search/index.js";
import { MindeeApiV2 } from "./http/mindeeApiV2.js";
import { MindeeHttpErrorV2 } from "./http/errors.js";
import { PollingOptions, PollingOptionsConstructor } from "./clientOptions/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";
import { BaseSearch } from "@/v2/search/baseSearch.js";
import { ModelSearch } from "@/v2/search/models/modelSearch.js";
import { LocalInputSource } from "@/input/index.js";

/**
 * Options for the V2 Mindee Client.
 * @example
 * const client = new MindeeClientV2({
 *   apiKey: "YOUR_API_KEY",
 *   throwOnError: true,
 *   debug: false
 * });
 */
export interface ClientOptions {
  /** Your API key for all endpoints. */
  apiKey?: string;
  /** Log debug messages. */
  debug?: boolean;
  /** Custom Dispatcher instance for the HTTP requests. */
  dispatcher?: Dispatcher;
}

/**
 * Mindee Client V2 class that centralizes most basic operations.
 */
export class Client {
  /**
   * Mindee V2 API handler.
   */
  protected mindeeApi: MindeeApiV2;

  /**
   * @param {ClientOptions} options options for the initialization of a client.
   */
  constructor(
    { apiKey, debug, dispatcher }: ClientOptions = {
      apiKey: undefined,
      debug: false,
      dispatcher: undefined,
    }
  ) {
    this.mindeeApi = new MindeeApiV2(dispatcher, apiKey);
    errorHandler.throwOnError = true;
    logger.level =
      debug ?? process.env.MINDEE_DEBUG
        ? LOG_LEVELS["debug"]
        : LOG_LEVELS["warn"];
    logger.debug("Client V2 Initialized");
  }

  /**
   * Enqueues a product inference job without waiting for completion.
   */
  async enqueue<P extends typeof BaseProduct>(
    product: P,
    inputSource: InputSource,
    params: InstanceType<P["parametersClass"]> | ConstructorParameters<P["parametersClass"]>[0],
  ): Promise<JobResponse> {
    if (inputSource === undefined) {
      throw new MindeeError("An input document is required.");
    }
    const paramsInstance = params instanceof product.parametersClass
      ? params
      : new product.parametersClass(params);
    await inputSource.init();
    const jobResponse = await this.mindeeApi.reqPostProductEnqueue(
      product, inputSource, paramsInstance
    );
    if (jobResponse.job.id === undefined || jobResponse.job.id.length === 0) {
      logger.error(`Failed enqueueing:\n${jobResponse.getRawHttp()}`);
      throw new MindeeError("Enqueueing of the document failed.");
    }
    logger.debug(
      `Successfully enqueued document with job ID: ${jobResponse.job.id}.`
    );
    return jobResponse;
  }

  /**
   * Retrieves the result of a previously enqueued request.
   *
   * @param product the product to retrieve.
   * @param inferenceId id of the queue to poll.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @returns a `Promise` containing the inference.
   */
  async getResult<P extends typeof BaseProduct>(
    product: P,
    inferenceId: string
  ): Promise<InstanceType<P["responseClass"]>> {
    logger.debug(
      `Attempting to get inference with ID: ${inferenceId} using response type: ${product.name}`
    );
    return await this.mindeeApi.reqGetProductResultById(product, inferenceId);
  }

  /**
   * Retrieves the result of a previously enqueued request.
   * This method is used when manually polling the server for the result URL.
   *
   * @param product the product to retrieve.
   * @param url URL as given in the `getJob()` response.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @returns a `Promise` containing the inference.
   */
  async getResultByUrl<P extends typeof BaseProduct>(
    product: P,
    url: string
  ): Promise<InstanceType<P["responseClass"]>> {
    logger.debug(
      `Attempting to get inference from: ${url} using response type: ${product.name}`
    );
    return await this.mindeeApi.reqGetProductResultByUrl(product, url);
  }

  /**
   * Get the processing status of a previously enqueued request.
   * Can be used for polling.
   *
   * @param jobId id of the queue to poll.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @returns a `Promise` containing a `Job`, which also contains a `Document` if the
   * parsing is complete.
   */
  async getJob(jobId: string): Promise<JobResponse> {
    return await this.mindeeApi.reqGetJobById(jobId);
  }

  /**
   * Enqueue a request and poll the server until the result is sent or
   * until the maximum number of tries is reached.
   *
   * @param product the product to retrieve.
   * @param inputSource file or URL to parse.
   * @param params parameters relating to prediction options.
   *
   * @param pollingOptions options for the polling loop, see {@link PollingOptions}.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @returns a `Promise` containing parsing results.
   */
  async enqueueAndGetResult<P extends typeof BaseProduct>(
    product: P,
    inputSource: InputSource,
    params: InstanceType<P["parametersClass"]> | ConstructorParameters<P["parametersClass"]>[0],
    pollingOptions?: PollingOptions | PollingOptionsConstructor,
  ): Promise<InstanceType<P["responseClass"]>> {
    const paramsInstance = params instanceof product.parametersClass
      ? params
      : new product.parametersClass(params);
    const jobResponse: JobResponse = await this.enqueue(
      product, inputSource, paramsInstance
    );

    const pollingOptionsInstance = pollingOptions instanceof PollingOptions
      ? pollingOptions
      : new PollingOptions(pollingOptions);
    return await this.pollForResult(
      product, pollingOptionsInstance, jobResponse
    );
  }

  /**
   * Send a document to an endpoint and poll the server until the result is sent or
   * until the maximum number of tries is reached.
   * @protected
   */
  protected async pollForResult<P extends typeof BaseProduct>(
    product: typeof BaseProduct,
    pollingOptions: PollingOptions,
    jobResponse: JobResponse,
  ): Promise<InstanceType<P["responseClass"]>> {
    logger.debug(
      `Waiting ${pollingOptions.initialDelaySec} seconds before polling.`
    );
    await setTimeout(
      pollingOptions.initialDelaySec * 1000,
      undefined,
      pollingOptions.initialTimerOptions
    );
    logger.debug(
      `Start polling for inference using job ID: ${jobResponse.job.id}.`
    );
    let retryCounter: number = 1;
    let pollResults: JobResponse;
    while (retryCounter < pollingOptions.maxRetries + 1) {
      logger.debug(
        `Attempt ${retryCounter} of ${pollingOptions.maxRetries}`
      );
      pollResults = await this.mindeeApi.reqGetJobByUrl(jobResponse.job.pollingUrl);
      const error: ErrorResponse | undefined = pollResults.job.error;
      if (error) {
        throw new MindeeHttpErrorV2(error);
      }
      logger.debug(`Job status: ${pollResults.job.status}.`);
      if (pollResults.job.status === "Failed") {
        break;
      }
      if (pollResults.job.status === "Processed") {
        if (!pollResults.job.resultUrl) {
          throw new MindeeError(
            "The result URL is undefined. This is a server error, try again later or contact support."
          );
        }
        return this.getResultByUrl(product, pollResults.job.resultUrl);
      }
      await setTimeout(
        pollingOptions.delaySec * 1000,
        undefined,
        pollingOptions.recurringTimerOptions
      );
      retryCounter++;
    }

    throw new MindeeError(
      `Polling failed to retrieve a result after ${retryCounter} attempts. ` +
      "You can increase poll attempts by passing the pollingOptions argument to enqueueAndGetResult()"
    );
  }

  /**
   * Search for models available to the account.
   * @param name Optional name filter.
   * @param modelType Optional model type filter.
   * @returns a `Promise` containing the search response.
   * @deprecated Use `search(ModelSearch, {})` instead.
   */
  async searchModels(name?: string, modelType?: string): Promise<SearchResponse> {
    return await this.search(ModelSearch, { name: name, modelType: modelType });
  }

  /**
   * Search for resources matching the given criteria.
   * @param search Search definition class to use.
   * @param searchParameters Search parameters.
   * @returns a `Promise` containing the search response with the matching resources.
   */
  async search<S extends typeof BaseSearch>(
    search: S,
    searchParameters: InstanceType<S["parametersClass"]> | ConstructorParameters<S["parametersClass"]>[0],
  ): Promise<InstanceType<S["responseClass"]>> {
    if (!searchParameters) {
      throw new MindeeError("Search parameters are required.");
    }
    const paramsInstance = searchParameters instanceof search.parametersClass
      ? searchParameters
      : new search.parametersClass(searchParameters);
    return await this.mindeeApi.reqGetSearch(search, paramsInstance);
  }

  /**
   * Not recommended for general use, prefer `getReadyRagDocumentPoll`.
   * You will need to poll until the document is ready for use.
   * Get a document's info and annotations from the RAG database.
   *
   * @param product the product the RAG database belongs to.
   * @param documentId the document's ID.
   */
  async getRagDocument<P extends typeof BaseProduct>(
    product: P,
    documentId: string
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    logger.debug(`Getting RAG document ID: ${documentId}`);
    return await this.mindeeApi.reqGetRagAnnotation(product, documentId);
  }

  /**
   * Get a document's info and annotations from the RAG database.
   *
   * @param product the product the RAG database belongs to.
   * @param documentId the document's ID.
   * @param pollingOptions options for the polling loop, see {@link PollingOptions}.
   * @returns a `Promise` containing the RAG document annotation.
   */
  async getReadyRagDocumentPoll<P extends typeof BaseProduct>(
    product: P,
    documentId: string,
    pollingOptions?: PollingOptionsConstructor
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    const initialResponse = await this.getRagDocument(product, documentId);
    if (initialResponse.status !== "Processing") {
      return initialResponse;
    }
    const pollingOptionsInstance = pollingOptions instanceof PollingOptions
      ? pollingOptions
      : new PollingOptions(pollingOptions);
    return await this.pollForRagDocument(product, initialResponse, pollingOptionsInstance);
  }

  /**
   * Not recommended for general use, prefer `uploadAndGetRagDocumentPoll`.
   * You will need to poll until the document is ready for use.
   * Add a document to the RAG database.
   *
   * @param product The product the RAG database belongs to.
   * @param inputSource The file to upload.
   * @param parameters The parameters to use for the upload.
   */
  async uploadRagDocument<P extends typeof BaseProduct>(
    product: P,
    inputSource: LocalInputSource,
    parameters: InstanceType<P["ragDocumentUploadClass"]> | ConstructorParameters<P["ragDocumentUploadClass"]>[0]
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    logger.debug("Adding a document to the RAG database");
    const paramsInstance = parameters instanceof product.ragDocumentUploadClass
      ? parameters
      : new product.ragDocumentUploadClass(parameters);
    await inputSource.init();
    return await this.mindeeApi.reqPostRagDocument(product, paramsInstance, inputSource);
  }

  /**
   * Add a document to the RAG database and return the initial annotation.
   *
   * @param product The product the RAG database belongs to.
   * @param inputSource The file to upload.
   * @param parameters The parameters to use for the upload.
   * @param pollingOptions options for the polling loop, see {@link PollingOptions}.
   */
  async uploadAndGetRagDocumentPoll<P extends typeof BaseProduct>(
    product: P,
    inputSource: LocalInputSource,
    parameters: InstanceType<P["ragDocumentUploadClass"]> | ConstructorParameters<P["ragDocumentUploadClass"]>[0],
    pollingOptions?: PollingOptions | PollingOptionsConstructor
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    const initialResponse = await this.uploadRagDocument(product, inputSource, parameters);
    if (initialResponse.status !== "Processing") {
      return initialResponse;
    }

    const pollingOptionsInstance = pollingOptions instanceof PollingOptions
      ? pollingOptions
      : new PollingOptions(pollingOptions);
    return await this.pollForRagDocument(product, initialResponse, pollingOptionsInstance);
  }

  async updateRagAnnotation<P extends typeof BaseProduct>(
    product: P,
    parameters: InstanceType<P["annotationParametersClass"]> | ConstructorParameters<P["annotationParametersClass"]>[0]
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    const paramsInstance = parameters instanceof product.annotationParametersClass
      ? parameters
      : new product.annotationParametersClass(parameters);

    logger.debug(`Updating RAG document ID: ${paramsInstance.documentId}`);

    return await this.mindeeApi.reqPatchRagAnnotation(product, paramsInstance);
  }

  /**
   * Update a document's annotations in the RAG database and poll until ready.
   *
   * @param product The product the RAG database belongs to.
   * @param parameters The parameters to use for the update.
   * @param pollingOptions options for the polling loop, see {@link PollingOptions}.
   * @returns a `Promise` containing the RAG document annotation.
   */
  async updateAndGetRagAnnotationPoll<P extends typeof BaseProduct>(
    product: P,
    parameters: InstanceType<P["annotationParametersClass"]> | ConstructorParameters<P["annotationParametersClass"]>[0],
    pollingOptions?: PollingOptions | PollingOptionsConstructor
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    const initialResponse = await this.mindeeApi.reqPatchRagAnnotation(product, parameters);

    if (initialResponse.status !== "Processing") {
      return initialResponse;
    }

    const pollingOptionsInstance = pollingOptions instanceof PollingOptions
      ? pollingOptions
      : new PollingOptions(pollingOptions);

    return await this.pollForRagDocument(product, initialResponse, pollingOptionsInstance);
  }

  /**
   * Get a document's info and annotations from the RAG database.
   * @param product the product the RAG database belongs to.
   * @param documentId the document's ID.
   */
  async deleteRagDocument<P extends typeof BaseProduct>(
    product: P,
    documentId: string
  ): Promise<boolean> {
    return await this.mindeeApi.reqDeleteRagDocument(product, documentId);
  }

  /**
   * Poll until the document is finished processing or the max number of attempts is reached.
   *
   * @param product The product the RAG database belongs to.
   * @param initialResponse The initial response containing the document's ID.
   * @param pollingOptions Options for the polling loop, see {@link PollingOptions}.
   * @returns A `Promise` containing the RAG document annotation.
   * @protected
   */
  protected async pollForRagDocument<P extends typeof BaseProduct>(
    product: P,
    initialResponse: InstanceType<P["annotationResponseClass"]>,
    pollingOptions: PollingOptions
  ): Promise<InstanceType<P["annotationResponseClass"]>> {
    logger.debug(`Polling for RAG document ID: ${initialResponse.id}`);
    const maxRetries = pollingOptions.maxRetries + 1;

    logger.debug(
      `Waiting ${pollingOptions.initialDelaySec} seconds before attempting to retrieve the result...`
    );
    await setTimeout(
      pollingOptions.initialDelaySec * 1000,
      undefined,
      pollingOptions.initialTimerOptions
    );

    const documentId = initialResponse.id;
    let retryCount = 1;

    while (retryCount < maxRetries) {
      await setTimeout(
        pollingOptions.delaySec * 1000,
        undefined,
        pollingOptions.recurringTimerOptions
      );

      logger.debug(
        `Poll attempt ${retryCount} of ${pollingOptions.maxRetries}`
      );

      const response = await this.getRagDocument(product, documentId);

      retryCount++;

      switch (response.status) {
      case "Processing":
        continue;
      case "Failed":
        throw new MindeeError("Job failed without an error payload.");
      default:
        return response;
      }
    }

    throw new MindeeError(`RAG polling not complete after ${retryCount} attempts.`);
  }
}
