import { StringDict } from "@/parsing/index.js";
import { BaseResponse } from "@/v2/parsing/baseResponse.js";
import { PaginationMetadata } from "./paginationMetadata.js";
import { SearchModel } from "./searchModel.js";

/**
 * Models search response.
 */
export class SearchResponse extends BaseResponse {
  /**
   * List of models returned by the search.
   */
  public models: SearchModel[];

  /**
   * Pagination metadata.
   */
  public pagination: PaginationMetadata;

  constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.models = (serverResponse["models"] ?? []).map(
      (model: StringDict) => new SearchModel(model)
    );
    this.pagination = new PaginationMetadata(serverResponse["pagination"]);
  }

  toString(): string {
    const lines: string[] = ["Models", "#######"];
    for (const model of this.models) {
      lines.push(`* :Name: ${model.name}`);
      lines.push(`  :ID: ${model.id}`);
      lines.push(`  :Model Type: ${model.modelType}`);
    }
    lines.push("Pagination", "##########");
    lines.push(this.pagination.toString());
    return lines.join("\n");
  }
}
