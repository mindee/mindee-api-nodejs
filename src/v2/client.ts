import { setTimeout } from "node:timers/promises";
import { Dispatcher } from "undici";
import { InputSource } from "@/input/index.js";
import { errorHandler } from "@/errors/handler.js";
import { LOG_LEVELS, logger } from "@/logger.js";
import { StringDict } from "@/parsing/stringDict.js";
import { ErrorResponse, InferenceResponse, JobResponse } from "./parsing/index.js";
import { MindeeApiV2 } from "./http/mindeeApiV2.js";
import { MindeeHttpErrorV2 } from "./http/errors.js";
import { PollingOptions, DataSchema } from "./client/index.js";
import { setAsyncParams } from "./client/pollingOptions.js";

/**
 * Parameters accepted by the asynchronous **inference** v2 endpoint.
 *
 * All fields are optional except `modelId`.
 *
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
  /** Model ID to use for the inference. **Required** */
  modelId: string;
  /** Use Retrieval-Augmented Generation during inference. */
  rag?: boolean;
  /** Extract the entire text from the document as strings, and fill the `rawText` attribute. */
  rawText?: boolean;
  /** Calculate bounding box polygons for values, and fill the `locations` attribute of fields. */
  polygon?: boolean;
  /** Calculate confidence scores for values, and fill the `confidence` attribute of fields.
   * Useful for automation.*/
  confidence?: boolean;
  /** Use an alias to link the file to your own DB. If empty, no alias will be used. */
  alias?: string;
  /** Additional text context used by the model during inference.
   * *Not recommended*, for specific use only. */
  textContext?: string;
  /** Webhook IDs to call after all processing is finished.
   * If empty, no webhooks will be used. */
  webhookIds?: string[];
  /** Client-side polling configuration (see {@link PollingOptions}). */
  pollingOptions?: PollingOptions;
  /** By default, the file is closed once the upload is finished.
   * Set to `false` to keep it open. */
  closeFile?: boolean;
  /**
   * Dynamic changes to the data schema of the model for this inference.
   * Not recommended, for specific use only.
   */
  dataSchema?: DataSchema|StringDict|string;
}

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
  /** Raise an `Error` on errors. */
  throwOnError?: boolean;
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
    { apiKey, throwOnError, debug, dispatcher }: ClientOptions = {
      apiKey: undefined,
      throwOnError: true,
      debug: false,
      dispatcher: undefined,
    }
  ) {
    this.mindeeApi = new MindeeApiV2(dispatcher, apiKey);
    errorHandler.throwOnError = throwOnError ?? true;
    logger.level =
      debug ?? process.env.MINDEE_DEBUG
        ? LOG_LEVELS["debug"]
        : LOG_LEVELS["warn"];
    logger.debug("Client V2 Initialized");
  }

  /**
   * Checks the Data Schema.
   * @param params Input Inference parameters.
   */
  validateDataSchema(params: InferenceParameters): void {
    if (params.dataSchema !== undefined && params.dataSchema !== null){
      if (!(params.dataSchema instanceof DataSchema)){
        params.dataSchema = new DataSchema(params.dataSchema);
      }
    }
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
    this.validateDataSchema(params);
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
    const validatedAsyncParams = setAsyncParams(params.pollingOptions);
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
Attempt no. ${retryCounter} of ${validatedAsyncParams.maxRetries}.
Job status: ${pollResults.job.status}.`
      );
      await setTimeout(validatedAsyncParams.delaySec * 1000, undefined, validatedAsyncParams.recurringTimerOptions);
      pollResults = await this.getJob(queueId);
      retryCounter++;
    }
    const error: ErrorResponse | undefined = pollResults.job.error;
    if (error) {
      throw new MindeeHttpErrorV2(error);
    }
    throw Error(
      "Asynchronous parsing request timed out after " +
      validatedAsyncParams.delaySec * retryCounter +
      " seconds"
    );
  }
}
