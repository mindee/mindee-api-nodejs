import { BaseProductParameters, BaseProductParametersConstructor } from "@/v2/clientOptions/baseProductParameters.js";
import { logger } from "@/logger.js";

/**
 * Parameters for sending a file to a Classification product.
 */
export class ClassificationParameters extends BaseProductParameters {
  constructor(params: BaseProductParametersConstructor & {}) {
    super({ ...params });
    logger.debug("Classification parameters initialized.");
  }
}
