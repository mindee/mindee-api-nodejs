import { StringDict } from "@/parsing/index.js";
import { BaseResponse } from "@/v2/parsing/baseResponse.js";
import { PaginationMetadata } from "./paginationMetadata.js";

/** Constructor type for a search response class with a static slug property. */
export type SearchResponseConstructor<T extends BaseSearchResponse> =
  (new (serverResponse: any) => T) & { readonly slug: string };


/**
 * Base class for search responses.
 */
export abstract class BaseSearchResponse extends BaseResponse {
  /**
   * Pagination metadata.
   */
  public pagination: PaginationMetadata;

  protected constructor(serverResponse: StringDict) {
    super(serverResponse);
    this.pagination = new PaginationMetadata(serverResponse["pagination"]);
  }

  protected abstract bodyLines(): string[];

  toString(): string {
    const lines: string[] = this.bodyLines();
    lines.push("Pagination Metadata", "###################");
    lines.push(this.pagination.toString());
    return lines.join("\n");
  }
}
