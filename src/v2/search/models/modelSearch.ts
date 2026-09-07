import { ModelSearchParameters } from "@/v2/search/index.js";
import { BaseSearch } from "@/v2/search/baseSearch.js";
import { ModelSearchResponse } from "@/v2/search/models/modelSearchResponse.js";

/**
 * Search for models within the organization linked to the API key.
 *
 * All search filters are optional.
 * If no search filters are given, all models belonging to the organization are returned.
 *
 * Results are paginated.
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
