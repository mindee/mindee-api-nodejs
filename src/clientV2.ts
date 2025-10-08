import { InputSource } from "./input";
import { errorHandler } from "./errors/handler";
import { LOG_LEVELS, logger } from "./logger";

import { setTimeout } from "node:timers/promises";
import { ErrorResponse, InferenceResponse, JobResponse } from "./parsing/v2";
import { MindeeApiV2 } from "./http/mindeeApiV2";
import { MindeeHttpErrorV2 } from "./errors/mindeeError";

/**
 * Parameters for the internal polling loop in {@link ClientV2.enqueueAndGetInference | enqueueAndGetInference()} .
 *
 * Default behavior:
 * - `initialDelaySec` = 2s
 * - `delaySec` = 1.5s
 * - `maxRetries` = 80
 *
 * Validation rules:
 * - `initialDelaySec` >= 1
 * - `delaySec` >= 1
 * - `maxRetries` >= 2
 *
 * The `initialTimerOptions` and `recurringTimerOptions` objects let you pass an
 * `AbortSignal` or make the timer `unref`-ed to the `setTimeout()`.
 *
 * @property initialDelaySec Number of seconds to wait **before the first poll**.
 * @property delaySec Interval in seconds between two consecutive polls.
 * @property maxRetries Maximum number of polling attempts (including the first one).
 * @property initialTimerOptions Options passed to the initial `setTimeout()`.
 * @property recurringTimerOptions Options passed to every recurring `setTimeout()`.
 *
 * @category ClientV2
 * @example
 * const params = {
 *   initialDelaySec: 4,
 *   delaySec: 2,
 *   maxRetries: 50
 * };
 *
 * const inference = await client.enqueueAndGetInference(inputDoc, params);
 */

export interface PollingOptions {
  initialDelaySec?: number;
  delaySec?: number;
  maxRetries?: number;
  initialTimerOptions?: {
    ref?: boolean,
    signal?: AbortSignal
  };
  recurringTimerOptions?: {
    ref?: boolean,
    signal?: AbortSignal
  }
}

interface ValidatedPollingOptions extends PollingOptions {
  initialDelaySec: number;
  delaySec: number;
  maxRetries: number;
}

/**
 * Parameters accepted by the asynchronous **inference** v2 endpoint.
 *
 * All fields are optional except `modelId`.
 *
 * @property modelId Identifier of the model that must process the document. **Required**.
 * @property rag Enhance extraction accuracy with Retrieval-Augmented Generation.
 * @property rawText Extract the full text content from the document as strings, and fill the `raw_text` attribute.
 * @property polygon Calculate bounding box polygons for all fields, and fill their `locations` attribute.
 * @property confidence Boost the precision and accuracy of all extractions.
 *     Calculate confidence scores for all fields and fill their `confidence` attribute.
 * @property alias Custom alias assigned to the uploaded document.
 * @property webhookIds List of webhook UUIDs that will receive the final API response.
 * @property pollingOptions Client-side polling configuration (see {@link PollingOptions}).
 * @property closeFile By default the file is closed once the upload is finished, set to `false` to keep it open.
 * @category ClientV2
 * @example
 * const params = {
 *   modelId: "YOUR_MODEL_ID",
 *   rag: true,
 *   alias: "YOUR_ALIAS",
 *   webhookIds: ["YOUR_WEBHOOK_ID_1", "YOUR_WEBHOOK_ID_2"],
 *   pollingOptions: {
 *     initialDelaySec: 2,
 *     delaySec: 1.5,
 *   }
 * };
 */
export interface InferenceParameters {
  modelId: string;
  rag?: boolean;
  rawText?: boolean;
  polygon?: boolean;
  confidence?: boolean;
  alias?: string;
  webhookIds?: string[];
  pollingOptions?: PollingOptions;
  closeFile?: boolean;
}

/**
 * Options for the V2 Mindee Client.
 *
 * @property apiKey Your API key for all endpoints.
 * @property throwOnError Raise an `Error` on errors.
 * @property debug Log debug messages.
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
  apiKey?: string;
  throwOnError?: boolean;
  debug?: boolean;
}

/**
 * Mindee Client V2 class that centralizes most basic operations.
 *
 * @category ClientV2
 */
export class ClientV2 {
  /** Mindee API handler. */
  protected mindeeApi: MindeeApiV2;

  /**
   * @param {ClientOptions} options options for the initialization of a client.
   */
  constructor(
    { apiKey, throwOnError, debug }: ClientOptions = {
      apiKey: "",
      throwOnError: true,
      debug: false,
    }
  ) {
    this.mindeeApi = new MindeeApiV2(apiKey);
    errorHandler.throwOnError = throwOnError ?? true;
    logger.level =
      debug ?? process.env.MINDEE_DEBUG
        ? LOG_LEVELS["debug"]
        : LOG_LEVELS["warn"];
    logger.debug("ClientV2 initialized");
  }

  /**
   * Send the document to an asynchronous endpoint and return its ID in the queue.
   * @param inputSource file or URL to parse.
   * @param params parameters relating to prediction options.
   * @category Asynchronous
   * @returns a `Promise` containing the job (queue) corresponding to a document.
   */
  async enqueueInference(
    inputSource: InputSource,
    params: InferenceParameters
  ): Promise<JobResponse> {
    if (inputSource === undefined) {
      throw new Error("The 'enqueue' function requires an input document.");
    }
    await inputSource.init();
    return await this.mindeeApi.reqPostInferenceEnqueue(inputSource, params);
  }

  /**
   * Retrieves an inference.
   *
   * @param inferenceId id of the queue to poll.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Asynchronous
   * @returns a `Promise` containing a `Job`, which also contains a `Document` if the
   * parsing is complete.
   */
  async getInference(inferenceId: string): Promise<InferenceResponse> {
    return await this.mindeeApi.reqGetInference(inferenceId);
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
   * Checks the values for asynchronous parsing. Returns their corrected value if they are undefined.
   * @param asyncParams parameters related to asynchronous parsing
   * @returns A valid `AsyncOptions`.
   */
  #setAsyncParams(asyncParams: PollingOptions | undefined = undefined): ValidatedPollingOptions {
    const minDelaySec = 1;
    const minInitialDelay = 1;
    const minRetries = 2;
    let newAsyncParams: PollingOptions;
    if (asyncParams === undefined) {
      newAsyncParams = {
        delaySec: 1.5,
        initialDelaySec: 2,
        maxRetries: 80
      };
    } else {
      newAsyncParams = { ...asyncParams };
      if (
        !newAsyncParams.delaySec ||
        !newAsyncParams.initialDelaySec ||
        !newAsyncParams.maxRetries
      ) {
        throw Error("Invalid polling options.");
      }
      if (newAsyncParams.delaySec < minDelaySec) {
        throw Error(`Cannot set auto-parsing delay to less than ${minDelaySec} second(s).`);
      }
      if (newAsyncParams.initialDelaySec < minInitialDelay) {
        throw Error(`Cannot set initial parsing delay to less than ${minInitialDelay} second(s).`);
      }
      if (newAsyncParams.maxRetries < minRetries) {
        throw Error(`Cannot set retry to less than ${minRetries}.`);
      }
    }
    return newAsyncParams as ValidatedPollingOptions;
  }

  /**
   * Send a document to an endpoint and poll the server until the result is sent or
   * until the maximum number of tries is reached.
   *
   * @param inputSource file or URL to parse.
   * @param params parameters relating to prediction options.
   *
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Synchronous
   * @returns a `Promise` containing parsing results.
   */
  async enqueueAndGetInference(
    inputSource: InputSource,
    params: InferenceParameters
  ): Promise<InferenceResponse> {
    const validatedAsyncParams = this.#setAsyncParams(params.pollingOptions);
    const enqueueResponse: JobResponse = await this.enqueueInference(inputSource, params);
    if (enqueueResponse.job.id === undefined || enqueueResponse.job.id.length === 0) {
      logger.error(`Failed enqueueing:\n${enqueueResponse.getRawHttp()}`);
      throw Error("Enqueueing of the document failed.");
    }
    const queueId: string = enqueueResponse.job.id;
    logger.debug(
      `Successfully enqueued document with job id: ${queueId}.`
    );

    await setTimeout(validatedAsyncParams.initialDelaySec * 1000, undefined, validatedAsyncParams.initialTimerOptions);
    let retryCounter: number = 1;
    let pollResults: JobResponse = await this.getJob(queueId);
    while (retryCounter < validatedAsyncParams.maxRetries) {
      if (pollResults.job.status === "Failed") {
        break;
      }
      if (pollResults.job.status === "Processed") {
        return this.getInference(pollResults.job.id);
      }
      logger.debug(
        `Polling server for parsing result with queueId: ${queueId}.
Attempt n°${retryCounter}/${validatedAsyncParams.maxRetries}.
Job status: ${pollResults.job.status}.`
      );
      await setTimeout(validatedAsyncParams.delaySec * 1000, undefined, validatedAsyncParams.recurringTimerOptions);
      pollResults = await this.getJob(queueId);
      retryCounter++;
    }
    const error: ErrorResponse | undefined = pollResults.job.error;
    if (error) {
      throw new MindeeHttpErrorV2(error.status, error.detail);
    }
    throw Error(
      "Asynchronous parsing request timed out after " +
      validatedAsyncParams.delaySec * retryCounter +
      " seconds"
    );
  }
}
