import { setTimeout } from "node:timers/promises";
import { Dispatcher } from "undici";
import { InputSource } from "@/input/index.js";
import { MindeeError } from "@/errors/index.js";
import { errorHandler } from "@/errors/handler.js";
import { LOG_LEVELS, logger } from "@/logger.js";
import {
  ErrorResponse,
  JobResponse,
  InferenceResponseConstructor,
  BaseInference,
  BaseInferenceResponse,
  CropInference,
  OcrInference,
  SplitInference,
  ExtractionInference,
} from "./parsing/index.js";
import { MindeeApiV2 } from "./http/mindeeApiV2.js";
import { MindeeHttpErrorV2 } from "./http/errors.js";
import {
  BaseParameters,
  ExtractionParameters,
  CropParameters,
  OcrParameters,
  SplitParameters,
  ValidatedPollingOptions
} from "./client/index.js";

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

type EnqueueParameters =
  | CropParameters
  | ConstructorParameters<typeof CropParameters>[0]
  | OcrParameters
  | ConstructorParameters<typeof OcrParameters>[0]
  | SplitParameters
  | ConstructorParameters<typeof SplitParameters>[0]
  | ExtractionParameters
  | ConstructorParameters<typeof ExtractionParameters>[0];

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

  #getParametersClassFromInference<T extends BaseInference>(
    inferenceClass: InferenceResponseConstructor<T>,
    params: EnqueueParameters,
  ): BaseParameters {
    if (params instanceof BaseParameters) {
      return params;
    }
    switch (inferenceClass as any) {
    case CropInference:
      return new CropParameters(params);
    case OcrInference:
      return new OcrParameters(params);
    case SplitInference:
      return new SplitParameters(params);
    case ExtractionInference:
      return new ExtractionParameters(params);
    default:
      throw new Error("Unsupported inference class.");
    }
  }

  async enqueue<T extends BaseInference>(
    responseType: InferenceResponseConstructor<T>,
    inputSource: InputSource,
    params: EnqueueParameters,
  ): Promise<JobResponse> {
    if (inputSource === undefined) {
      throw new MindeeError("An input document is required.");
    }
    const paramsInstance = this.#getParametersClassFromInference(
      responseType, params
    );
    await inputSource.init();
    const jobResponse = await this.mindeeApi.reqPostInferenceEnqueue(
      inputSource, paramsInstance
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
   * @param responseType class of the inference to retrieve.
   * @param inferenceId id of the queue to poll.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Asynchronous
   * @returns a `Promise` containing the inference.
   */
  async getResult<T extends BaseInference>(
    responseType: InferenceResponseConstructor<T>,
    inferenceId: string
  ): Promise<BaseInferenceResponse<T>> {
    logger.debug(
      `Attempting to get inference with ID: ${inferenceId} using response type: ${responseType.name}`
    );
    return await this.mindeeApi.reqGetInference(responseType, inferenceId);
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
    return await this.mindeeApi.reqGetJob(jobId);
  }

  /**
   * Enqueue a request and poll the server until the result is sent or
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
  async enqueueAndGetResult<T extends BaseInference>(
    responseType: InferenceResponseConstructor<T>,
    inputSource: InputSource,
    params: EnqueueParameters
  ): Promise<BaseInferenceResponse<T>> {
    const paramsInstance = this.#getParametersClassFromInference(
      responseType, params
    );

    const pollingOptions = paramsInstance.getValidatedPollingOptions();

    const jobResponse: JobResponse = await this.enqueue(
      responseType, inputSource, paramsInstance
    );
    return await this.pollForResult(
      responseType, pollingOptions, jobResponse.job.id
    );
  }

  /**
   * Send a document to an endpoint and poll the server until the result is sent or
   * until the maximum number of tries is reached.
   * @protected
   */
  protected async pollForResult<T extends BaseInference>(
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
        return this.getResult(responseType, pollResults.job.id);
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
