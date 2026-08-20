import { BaseSearchParameters, BaseSearchParametersConstructor } from "@/v2/clientOptions/baseSearchParameters.js";

/**
 * Constructor parameters for ModelSearchParameters.
 */
export interface ModelSearchParametersConstructor extends BaseSearchParametersConstructor {
  name?: string;
  modelType?: string;
}

/**
 * Search parameters for models.
 */
export class ModelSearchParameters extends BaseSearchParameters {
  /**
   * Case-insensitive search term for the model name
   */
  name?: string;

  /**
   * Case-insensitive search term for the model type
   */
  modelType?: string;

  constructor(params: ModelSearchParametersConstructor = {}) {
    super(params);
    this.name = params.name;
    this.modelType = params.modelType;
  }

  /** @inheritdoc */
  getRequestParameters(): Record<string, string> {
    const parameters = super.getRequestParameters();
    if (this.name) {
      parameters["name"] = this.name;
    }
    if (this.modelType) {
      parameters["model_type"] = this.modelType;
    }
    return parameters;
  }
}
