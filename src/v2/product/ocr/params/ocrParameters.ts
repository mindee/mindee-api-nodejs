import { BaseProductParameters, BaseProductParametersConstructor } from "@/v2/clientOptions/baseProductParameters.js";
import { logger } from "@/logger.js";

/**
 * Parameters for sending a file to a Raw Text (OCR) product.
 */
export class OcrParameters extends BaseProductParameters {
  constructor(params: BaseProductParametersConstructor & {}) {
    super({ ...params });
    logger.debug("OCR parameters initialized.");
  }
}
