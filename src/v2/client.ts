import { setTimeout } from "node:timers/promises";
import { Dispatcher } from "undici";
import { InputSource } from "@/input/index.js";
import { MindeeError } from "@/errors/index.js";
import { errorHandler } from "@/errors/handler.js";
import { LOG_LEVELS, logger } from "@/logger.js";
import { ErrorResponse, JobResponse } from "./parsing/index.js";
import { MindeeApiV2 } from "./http/mindeeApiV2.js";
import { MindeeHttpErrorV2 } from "./http/errors.js";
import { ValidatedPollingOptions } from "./client/index.js";
import { BaseProduct } from "@/v2/product/baseProduct.js";

/**
 * Options for the V2 Mindee Client.
 *
 * @category ClientV2
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
 *
 * @category ClientV2
 */
export class Client {
  /** Mindee V2 API handler. */
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
    const jobResponse = await this.mindeeApi.enqueueProduct(
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
   * @category Asynchronous
   * @returns a `Promise` containing the inference.
   */
  async getResult<P extends typeof BaseProduct>(
    product: P,
    inferenceId: string
  ): Promise<InstanceType<P["responseClass"]>> {
    logger.debug(
      `Attempting to get inference with ID: ${inferenceId} using response type: ${product.name}`
    );
    return await this.mindeeApi.getProductResult(product, inferenceId);
  }

  /**
   * Get the processing status of a previously enqueued request.
   * Can be used for polling.
   *
   * @param jobId id of the queue to poll.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Asynchronous
   * @returns a `Promise` containing a `Job`, which also contains a `Document` if the
   * parsing is complete.
   */
  async getJob(jobId: string): Promise<JobResponse> {
    return await this.mindeeApi.getJob(jobId);
  }

  /**
   * Enqueue a request and poll the server until the result is sent or
   * until the maximum number of tries is reached.
   *
   * @param product the product to retrieve.
   * @param inputSource file or URL to parse.
   * @param params parameters relating to prediction options.
   *
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Synchronous
   * @returns a `Promise` containing parsing results.
   */
  async enqueueAndGetResult<P extends typeof BaseProduct>(
    product: P,
    inputSource: InputSource,
    params: InstanceType<P["parametersClass"]> | ConstructorParameters<P["parametersClass"]>[0],
  ): Promise<InstanceType<P["responseClass"]>> {
    const paramsInstance = new product.parametersClass(params);

    const pollingOptions = paramsInstance.getValidatedPollingOptions();

    const jobResponse: JobResponse = await this.enqueue(
      product, inputSource, paramsInstance
    );
    return await this.pollForResult(
      product, pollingOptions, jobResponse.job.id
    );
  }

  /**
   * Send a document to an endpoint and poll the server until the result is sent or
   * until the maximum number of tries is reached.
   * @protected
   */
  protected async pollForResult<P extends typeof BaseProduct>(
    product: typeof BaseProduct,
    pollingOptions: ValidatedPollingOptions,
    queueId: string,
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
      `Start polling for inference using job ID: ${queueId}.`
    );
    let retryCounter: number = 1;
    let pollResults: JobResponse;
    while (retryCounter < pollingOptions.maxRetries + 1) {
      logger.debug(
        `Attempt ${retryCounter} of ${pollingOptions.maxRetries}`
      );
      pollResults = await this.getJob(queueId);
      const error: ErrorResponse | undefined = pollResults.job.error;
      if (error) {
        throw new MindeeHttpErrorV2(error);
      }
      logger.debug(`Job status: ${pollResults.job.status}.`);
      if (pollResults.job.status === "Failed") {
        break;
      }
      if (pollResults.job.status === "Processed") {
        return this.getResult(product, pollResults.job.id);
      }
      await setTimeout(
        pollingOptions.delaySec * 1000,
        undefined,
        pollingOptions.recurringTimerOptions
      );
      retryCounter++;
    }

    throw new MindeeError(
      "Asynchronous parsing request timed out after " +
      pollingOptions.delaySec * retryCounter +
      " seconds"
    );
  }
}
