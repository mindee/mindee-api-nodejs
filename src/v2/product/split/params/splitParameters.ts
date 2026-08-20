import {
  BaseProductParameters,
  BaseProductParametersConstructor,
} from "@/v2/clientOptions/baseProductParameters.js";
import { logger } from "@/logger.js";

/**
 * Parameters for sending a file to a Split product.
 */
export class SplitParameters extends BaseProductParameters {
  constructor(params: BaseProductParametersConstructor & {}) {
    super({ ...params });
    logger.debug("Split parameters initialized.");
  }
}
