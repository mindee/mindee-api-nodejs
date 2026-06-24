import { StringDict } from "@/parsing/index.js";

/**
 * PaginationMetadata data associated with model search.
 */
export class PaginationMetadata {
  /**
   * Number of items per page.
   */
  public perPage: number;

  /**
   * 1-indexed page number.
   */
  public page: number;

  /**
   * Total items.
   */
  public totalItems: number;

  /**
   * Total number of pages.
   */
  public totalPages: number;

  constructor(serverResponse: StringDict) {
    this.perPage = serverResponse["per_page"];
    this.page = serverResponse["page"];
    this.totalItems = serverResponse["total_items"];
    this.totalPages = serverResponse["total_pages"];
  }

  toString(): string {
    return [
      `:Per Page: ${this.perPage}`,
      `:Page: ${this.page}`,
      `:Total Items: ${this.totalItems}`,
      `:Total Pages: ${this.totalPages}`,
    ].join("\n");
  }
}
