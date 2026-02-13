import { StringDict } from "@/parsing/stringDict.js";
import { DataSchema } from "./dataSchema.js";
import { BaseParameters, BaseParametersConstructor } from "@/v2/client/baseParameters.js";
import { logger } from "@/logger.js";

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
export class ExtractionParameters extends BaseParameters {
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
   * Additional text context used by the model during inference.
   * *Not recommended*, for specific use only.
   */
  textContext?: string;
  /**
   * Dynamic changes to the data schema of the model for this inference.
   * Not recommended, for specific use only.
   */
  dataSchema?: DataSchema | StringDict | string;

  constructor(params: BaseParametersConstructor & {
    rag?: boolean;
    rawText?: boolean;
    polygon?: boolean;
    confidence?: boolean;
    textContext?: string;
    dataSchema?: DataSchema | StringDict | string;
  }) {
    super({ ...params });
    this.rag = params.rag;
    this.rawText = params.rawText;
    this.polygon = params.polygon;
    this.confidence = params.confidence;
    this.textContext = params.textContext;

    if (params.dataSchema !== undefined && params.dataSchema !== null) {
      if (!(params.dataSchema instanceof DataSchema)){
        this.dataSchema = new DataSchema(params.dataSchema);
      } else {
        this.dataSchema = params.dataSchema;
      }
    }
    logger.debug("Extraction parameters initialized.");
  }

  getFormData(): FormData {
    const form = new FormData();

    form.set("model_id", this.modelId);

    if (this.rag !== undefined && this.rag !== null) {
      form.set("rag", this.rag.toString());
    }
    if (this.polygon !== undefined && this.polygon !== null) {
      form.set("polygon", this.polygon.toString().toLowerCase());
    }
    if (this.confidence !== undefined && this.confidence !== null) {
      form.set("confidence", this.confidence.toString().toLowerCase());
    }
    if (this.rawText !== undefined && this.rawText !== null) {
      form.set("raw_text", this.rawText.toString().toLowerCase());
    }
    if (this.textContext !== undefined && this.textContext !== null) {
      form.set("text_context", this.textContext);
    }
    if (this.dataSchema !== undefined && this.dataSchema !== null) {
      form.set("data_schema", this.dataSchema.toString());
    }
    if (this.webhookIds && this.webhookIds.length > 0) {
      form.set("webhook_ids", this.webhookIds.join(","));
    }
    return form;
  }
}
