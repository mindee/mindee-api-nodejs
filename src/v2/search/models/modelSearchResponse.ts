import { StringDict } from "@/parsing/index.js";
import { BaseSearchResponse } from "@/v2/parsing/search/baseSearchResponse.js";
import { SearchModels } from "@/v2/parsing/search/searchModels.js";

/**
 * Models search response.
 */
export class ModelSearchResponse extends BaseSearchResponse {

  /**
   * Paginated list of matching models.
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
