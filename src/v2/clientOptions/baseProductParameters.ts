import { MindeeConfigurationError } from "@/errors/index.js";

/**
 * Constructor parameters for BaseParameters and its subclasses.
 */
export interface BaseProductParametersConstructor {
  modelId: string;
  alias?: string;
  webhookIds?: string[];
  closeFile?: boolean;
}

/**
 * Parameters accepted by all v2 products.
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
 * };
 */
export abstract class BaseProductParameters {
  /**
   * Model ID to use for the inference. **Required.**
   */
  modelId: string;
  /**
   * Optional: a free-form string to tag the request with your own identifier.
   * For example, an internal document ID, reference number, or database key.
   * If set, it will be included in the job and result responses.
   */
  alias?: string;
  /**
   * Webhook IDs to call after all processing is finished.
   * If empty, no webhooks will be used.
   */
  webhookIds?: string[];
  /**
   * By default, the file is closed once the upload is finished.
   * Set to `false` to keep it open.
   */
  closeFile?: boolean;

  protected constructor(params: BaseProductParametersConstructor) {
    if (params.modelId === undefined || params.modelId === null || params.modelId === "") {
      throw new MindeeConfigurationError("Model ID must be provided");
    }
    this.modelId = params.modelId;
    this.alias = params.alias;
    this.webhookIds = params.webhookIds;
    this.closeFile = params.closeFile;
  }

  /**
   * Gets the request parameters for the enqueue request.
   * @returns A `Record` mapping parameter names to their string values.
   */
  getRequestParameters(): Record<string, string> {
    const parameters: Record<string, string> = {};

    parameters["model_id"] = this.modelId;

    if (this.alias !== undefined && this.alias !== null) {
      parameters["alias"] = this.alias;
    }
    if (this.webhookIds && this.webhookIds.length > 0) {
      parameters["webhook_ids"] = this.webhookIds.join(",");
    }
    return parameters;
  }
}
