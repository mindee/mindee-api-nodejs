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
 *   alias: "YOUR_ALIAS",
 *   webhookIds: ["YOUR_WEBHOOK_ID_1", "YOUR_WEBHOOK_ID_2"],
 *   pollingOptions: {
 *     initialDelaySec: 2,
 *     delaySec: 1.5,
 *   }
 * };
 */
export class OcrParameters extends BaseParameters {
  constructor(params: BaseParametersConstructor & {}) {
    super({ ...params });
    logger.debug("OCR parameters initialized.");
  }
}
