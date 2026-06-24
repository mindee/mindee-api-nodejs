import { StringDict } from "@/parsing/stringDict.js";

/**
 * Pagination metadata associated with model search.
 */
export class PaginationMetadata {
  /** Number of items per page. */
  public perPage: number;
  /** 1-indexed page number. */
  public page: number;
  /** Total items returned by the query. */
  public totalItems: number;
  /** Total number of pages. */
  public totalPages: number;

  constructor(serverResponse: StringDict) {
    this.perPage = serverResponse?.["per_page"] ?? 0;
    this.page = serverResponse?.["page"] ?? 0;
    this.totalItems = serverResponse?.["total_items"] ?? 0;
    this.totalPages = serverResponse?.["total_pages"] ?? 0;
  }

  /**
   * String representation of the pagination metadata.
   */
  toString(): string {
    return `:Per Page: ${this.perPage}\n` +
      `:Page: ${this.page}\n` +
      `:Total Items: ${this.totalItems}\n` +
      `:Total Pages: ${this.totalPages}\n`;
  }
}
