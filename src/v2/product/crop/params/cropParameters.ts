import { BaseProductParameters, BaseProductParametersConstructor } from "@/v2/clientOptions/baseProductParameters.js";
import { logger } from "@/logger.js";

/**
 * Parameters for sending a file to a Crop product.
 */
export class CropParameters extends BaseProductParameters {
  constructor(params: BaseProductParametersConstructor & {}) {
    super({ ...params });
    logger.debug("Crop parameters initialized.");
  }
}
