import { StringDict } from "@/parsing/index.js";
import { BaseResponse } from "@/v2/parsing/baseResponse.js";
import { PaginationMetadata } from "./paginationMetadata.js";

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

  /**
   * Lines composing the response-specific body (header + items).
   * @returns An array of body lines.
   */
  protected abstract bodyLines(): string[];

  toString(): string {
    const lines: string[] = this.bodyLines();
    lines.push("Pagination Metadata", "###################");
    lines.push(this.pagination.toString());
    return lines.join("\n");
  }
}
