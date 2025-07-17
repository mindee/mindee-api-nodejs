import {
  LocalInputSource,
  LocalResponse,
} from "./input";
import { errorHandler } from "./errors/handler";
import { LOG_LEVELS, logger } from "./logger";

import { setTimeout } from "node:timers/promises";
import { MindeeError } from "./errors";
import { ErrorResponse, InferenceResponse, JobResponse } from "./parsing/v2";
import { MindeeApiV2 } from "./http/mindeeApiV2";
import { BaseClient } from "./baseClient";
import { MindeeHttpErrorV2 } from "./errors/mindeeError";

/**
 * Asynchronous polling parameters.
 */
interface OptionalPollingOptions {
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

interface PollingOptions {
  initialDelaySec: number;
  delaySec: number;
  maxRetries: number;
  initialTimerOptions?: {
    ref?: boolean,
    signal?: AbortSignal
  };
  recurringTimerOptions?: {
    ref?: boolean,
    signal?: AbortSignal
  }
}

export interface InferenceParams {
  /** ID of the model. **Required**. */
  modelId: string;
  /** Enable Retrieval-Augmented Generation (RAG). */
  rag?: boolean;
  /** Optional alias for the file. */
  alias?: string;
  /** IDs of the webhooks that should receive the API response. */
  webhookIds?: string[];
  /** Polling options. */
  pollingOptions?: OptionalPollingOptions;
  /** Set to `false` if the file must remain open after parsing. */
  closeFile?: boolean;
}


export interface ClientOptions {
  /** Your API key for all endpoints. */
  apiKey?: string;
  /** Raise an `Error` on errors. */
  throwOnError?: boolean;
  /** Log debug messages. */
  debug?: boolean;
}

/**
 * Mindee Client V2 class that centralizes most basic operations.
 *
 * @category ClientV2
 */
export class ClientV2 extends BaseClient {
  /** Key of the API. */
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
    super();
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
   * @param inputSource file to parse.
   * @param params parameters relating to prediction options.
   * @category Asynchronous
   * @returns a `Promise` containing the job (queue) corresponding to a document.
   */
  async enqueueInference(
    inputSource: LocalInputSource,
    params: InferenceParams
  ): Promise<JobResponse> {
    if (inputSource === undefined) {
      throw new Error("The 'enqueue' function requires an input document.");
    }
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
   * Load an inference.
   *
   * @param localResponse Local response to load.
   * @category V2
   * @returns A valid prediction
   */
  loadInference(
    localResponse: LocalResponse
  ): InferenceResponse {
    try {
      return new InferenceResponse(localResponse.asDict());
    } catch {
      throw new MindeeError("No prediction found in local response.");
    }
  }

  /**
   * Checks the values for asynchronous parsing. Returns their corrected value if they are undefined.
   * @param asyncParams parameters related to asynchronous parsing
   * @returns A valid `AsyncOptions`.
   */
  #setAsyncParams(asyncParams: OptionalPollingOptions | undefined = undefined): PollingOptions {
    const minDelaySec = 1;
    const minInitialDelay = 1;
    const minRetries = 2;
    let newAsyncParams: OptionalPollingOptions;
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
    return newAsyncParams as PollingOptions;
  }

  /**
   * Send a document to an endpoint and poll the server until the result is sent or
   * until the maximum number of tries is reached.
   *
   * @param inputDoc document to parse.
   * @param params parameters relating to prediction options.
   *
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Synchronous
   * @returns a `Promise` containing parsing results.
   */
  async enqueueAndGetInference(
    inputDoc: LocalInputSource,
    params: InferenceParams
  ): Promise<InferenceResponse> {
    const validatedAsyncParams = this.#setAsyncParams(params.pollingOptions);
    const enqueueResponse: JobResponse = await this.enqueueInference(inputDoc, params);
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
    let pollResults: JobResponse  = await this.getJob(queueId);
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
