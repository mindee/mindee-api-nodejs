import { StringDict } from "@/parsing/stringDict.js";
import { PollingOptions, ValidatedPollingOptions } from "./pollingOptions.js";
import { DataSchema } from "./dataSchema.js";

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
export class InferenceParameters {
  /**
   * Model ID to use for the inference. **Required.**
   */
  modelId: string;
  /**
   * Use Retrieval-Augmented Generation during inference.
   */
  rag?: boolean;
  /**
   * Extract the entire text from the document as strings, and fill the `rawText` attribute.
   */
  rawText?: boolean;
  /**
   * Calculate bounding box polygons for values, and fill the `locations` attribute of fields.
   */
  polygon?: boolean;
  /**
   * Calculate confidence scores for values, and fill the `confidence` attribute of fields.
   * Useful for automation.
   */
  confidence?: boolean;
  /**
   * Use an alias to link the file to your own DB.
   * If empty, no alias will be used.
   */
  alias?: string;
  /**
   * Additional text context used by the model during inference.
   * *Not recommended*, for specific use only.
   */
  textContext?: string;
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
  /**
   * Dynamic changes to the data schema of the model for this inference.
   * Not recommended, for specific use only.
   */
  dataSchema?: DataSchema | StringDict | string;

  constructor(params: {
    modelId: string;
    rag?: boolean;
    rawText?: boolean;
    polygon?: boolean;
    confidence?: boolean;
    alias?: string;
    textContext?: string;
    webhookIds?: string[];
    pollingOptions?: PollingOptions;
    closeFile?: boolean;
    dataSchema?: DataSchema | StringDict | string;
  }) {
    this.modelId = params.modelId;
    this.rag = params.rag;
    this.rawText = params.rawText;
    this.polygon = params.polygon;
    this.confidence = params.confidence;
    this.alias = params.alias;
    this.textContext = params.textContext;
    this.webhookIds = params.webhookIds;
    this.closeFile = params.closeFile;
    this.pollingOptions = params.pollingOptions;

    if (params.dataSchema !== undefined && params.dataSchema !== null) {
      if (!(params.dataSchema instanceof DataSchema)){
        this.dataSchema = new DataSchema(params.dataSchema);
      } else {
        this.dataSchema = params.dataSchema;
      }
    }
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
