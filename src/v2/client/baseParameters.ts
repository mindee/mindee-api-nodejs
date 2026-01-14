import { ValidatedPollingOptions } from "@/v2/client/pollingOptions.js";
import { PollingOptions } from "@/v2/index.js";
import { MindeeConfigurationError } from "@/errors/index.js";

/**
 * Constructor parameters for BaseParameters and its subclasses.
 */
export interface BaseParametersConstructor {
  modelId: string;
  alias?: string;
  webhookIds?: string[];
  pollingOptions?: PollingOptions;
  closeFile?: boolean;
}

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
export abstract class BaseParameters {
  /**
   * Model ID to use for the inference. **Required.**
   */
  modelId: string;
  /**
   * Use an alias to link the file to your own DB.
   * If empty, no alias will be used.
   */
  alias?: string;
  /**
   * Webhook IDs to call after all processing is finished.
   * If empty, no webhooks will be used.
   */
  webhookIds?: string[];
  /**
   * Client-side polling configuration (see {@link PollingOptions}).
   */
  pollingOptions?: PollingOptions;
  /**
   * By default, the file is closed once the upload is finished.
   * Set to `false` to keep it open.
   */
  closeFile?: boolean;

  protected constructor(params: BaseParametersConstructor) {
    if (params.modelId === undefined || params.modelId === null || params.modelId === "") {
      throw new MindeeConfigurationError("Model ID must be provided");
    }
    this.modelId = params.modelId;
    this.alias = params.alias;
    this.webhookIds = params.webhookIds;
    this.closeFile = params.closeFile;
    this.pollingOptions = params.pollingOptions;
  }

  /**
   * Checks the values for asynchronous parsing. Returns their corrected value if they are undefined.
   * @returns A valid `AsyncOptions`.
   */
  getValidatedPollingOptions(): ValidatedPollingOptions {
    const minDelaySec = 1;
    const minInitialDelay = 1;
    const minRetries = 2;
    let newAsyncParams: PollingOptions;
    if (this.pollingOptions === undefined) {
      newAsyncParams = {
        delaySec: 1.5,
        initialDelaySec: 2,
        maxRetries: 80
      };
    } else {
      newAsyncParams = { ...this.pollingOptions };
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
}
