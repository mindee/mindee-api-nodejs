import { StringDict } from "@/parsing/index.js";
import { BaseSearchResponse } from "./baseSearchResponse.js";
import { SearchModels } from "./searchModels.js";

/**
 * Models search response.
 */
export class ModelSearchResponse extends BaseSearchResponse {
  static readonly slug = "models";

  /**
   * List of models returned by the search.
   */
  public models: SearchModels;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.models = new SearchModels(serverResponse["models"] ?? []);
  }

  protected bodyLines(): string[] {
    return ["Models", "#######", this.models.toString()];
  }
}
