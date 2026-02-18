import { MindeeConfigurationError } from "@/errors/index.js";

/**
 * Constructor parameters for BaseParameters and its subclasses.
 */
export interface BaseParametersConstructor {
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
  }

  /**
   * Returns the form data to send to the API.
   * @returns A `FormData` object.
   */
  getFormData(): FormData {
    const form = new FormData();

    form.set("model_id", this.modelId);

    if (this.alias !== undefined && this.alias !== null) {
      form.set("alias", this.alias);
    }
    if (this.webhookIds && this.webhookIds.length > 0) {
      form.set("webhook_ids", this.webhookIds.join(","));
    }
    return form;
  }
}
