import { StringDict } from "@/parsing/stringDict.js";
import { BaseResponse } from "@/v2/parsing/baseResponse.js";
import { SearchModel } from "./searchModel.js";
import { PaginationMetadata } from "./paginationMetadata.js";

/**
 * Response of the `v2/search/models` endpoint.
 */
export class SearchResponse extends BaseResponse {
  /** List of all models matching the search query. */
  public models: SearchModel[];
  /** Pagination metadata. */
  public pagination: PaginationMetadata;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.models = Array.isArray(serverResponse["models"])
      ? serverResponse["models"].map((m: StringDict) => new SearchModel(m))
      : [];
    this.pagination = new PaginationMetadata(serverResponse["pagination"]);
  }

  /**
   * String representation of the response.
   */
  toString(): string {
    const modelsBlock = this.models.length === 0
      ? "\n"
      : this.models.map(m =>
        `* :Name: ${m.name}\n  :ID: ${m.id}\n  :Model Type: ${m.modelType}\n`
      ).join("");
    return "Models\n######\n" +
      modelsBlock + "\n" +
      "Pagination Metadata\n" +
      "###################\n" +
      this.pagination.toString();
  }
}
