import { setTimeout } from "node:timers/promises";
import { Dispatcher } from "undici";
import { InputSource } from "@/input/index.js";
import { MindeeError } from "@/errors/index.js";
import { errorHandler } from "@/errors/handler.js";
import { LOG_LEVELS, logger } from "@/logger.js";
import {
  ErrorResponse,
  ExtractionInference,
  JobResponse,
  InferenceResponseConstructor,
  BaseInference,
  BaseInferenceResponse,
} from "./parsing/index.js";
import { MindeeApiV2 } from "./http/mindeeApiV2.js";
import { MindeeHttpErrorV2 } from "./http/errors.js";
import { ExtractionParameters, UtilityParameters, ValidatedPollingOptions } from "./client/index.js";

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

  /**
   * Send the document to an asynchronous endpoint and return its ID in the queue.
   * @param inputSource file or URL to parse.
   * @param params parameters relating to prediction options.
   * @category Asynchronous
   * @returns a `Promise` containing the job (queue) corresponding to a document.
   */
  async enqueueExtraction(
    inputSource: InputSource,
    params: ExtractionParameters| ConstructorParameters<typeof ExtractionParameters>[0]
  ): Promise<JobResponse> {
    if (inputSource === undefined) {
      throw new MindeeError("An input document is required.");
    }
    const paramsInstance = params instanceof ExtractionParameters
      ? params
      : new ExtractionParameters(params);

    await inputSource.init();
    const jobResponse = await this.mindeeApi.reqPostInferenceEnqueue(
      ExtractionInference, inputSource, paramsInstance
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

  async enqueueInference<T extends BaseInference>(
    responseType: InferenceResponseConstructor<T>,
    inputSource: InputSource,
    params: UtilityParameters | ConstructorParameters<typeof UtilityParameters>[0]
  ): Promise<JobResponse> {
    if (inputSource === undefined) {
      throw new MindeeError("An input document is required.");
    }
    const paramsInstance = params instanceof UtilityParameters
      ? params
      : new UtilityParameters(params);

    await inputSource.init();
    const jobResponse = await this.mindeeApi.reqPostInferenceEnqueue(
      responseType, inputSource, paramsInstance
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
   * Retrieves an inference.
   *
   * @param responseType class of the inference to retrieve.
   * @param inferenceId id of the queue to poll.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Asynchronous
   * @returns a `Promise` containing the inference.
   */
  async getInference<T extends BaseInference>(
    responseType: InferenceResponseConstructor<T>,
    inferenceId: string
  ): Promise<BaseInferenceResponse<T>> {
    logger.debug(
      `Attempting to get inference with ID: ${inferenceId} using response type: ${responseType.name}`
    );
    return await this.mindeeApi.reqGetInference(responseType, inferenceId);
  }

  /**
   * Get the status of an inference that was previously enqueued.
   * Can be used for polling.
   *
   * @param jobId id of the queue to poll.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Asynchronous
   * @returns a `Promise` containing a `Job`, which also contains a `Document` if the
   * parsing is complete.
   */
  async getJob(jobId: string): Promise<JobResponse> {
    return await this.mindeeApi.reqGetJob(jobId);
  }

  /**
   * Send a document to an endpoint and poll the server until the result is sent or
   * until the maximum number of tries is reached.
   *
   * @param responseType class of the inference to retrieve.
   * @param inputSource file or URL to parse.
   * @param params parameters relating to prediction options.
   *
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Synchronous
   * @returns a `Promise` containing parsing results.
   */
  async enqueueAndGetInference<T extends BaseInference>(
    responseType: InferenceResponseConstructor<T>,
    inputSource: InputSource,
    params: UtilityParameters | ConstructorParameters<typeof UtilityParameters>[0]
  ): Promise<BaseInferenceResponse<T>> {
    const paramsInstance = params instanceof UtilityParameters
      ? params
      : new UtilityParameters(params);

    const pollingOptions = paramsInstance.getValidatedPollingOptions();

    const jobResponse: JobResponse = await this.enqueueInference(
      responseType, inputSource, paramsInstance
    );
    return await this.pollForInference(
      responseType, pollingOptions, jobResponse.job.id
    );
  }

  /**
   * Send a document to an endpoint and poll the server until the result is sent or
   * until the maximum number of tries is reached.
   * @protected
   */
  protected async pollForInference<T extends BaseInference>(
    responseType: InferenceResponseConstructor<T>,
    pollingOptions: ValidatedPollingOptions,
    queueId: string,
  ): Promise<BaseInferenceResponse<T>> {
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
        return this.getInference(responseType, pollResults.job.id);
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
