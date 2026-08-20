import { ModelSearchParameters } from "@/v2/search/index.js";
import { BaseSearch } from "@/v2/search/baseSearch.js";
import { ModelSearchResponse } from "@/v2/search/models/modelSearchResponse.js";

/**
 * Search for models.
 */
export class ModelSearch extends BaseSearch {
  /** @inheritDoc */
  static get parametersClass() {
    return ModelSearchParameters;
  }

  /** @inheritDoc */
  static get responseClass() {
    return ModelSearchResponse;
  }

  /** @inheritDoc */
  static get slug() {
    return "models";
  }
}
