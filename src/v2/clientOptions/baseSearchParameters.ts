/**
 * Constructor parameters for BaseSearchParameters and its subclasses.
 */
export interface BaseSearchParametersConstructor {
  page?: number;
  perPage?: number;
}

/**
 * Base parameters for searches.
 */
export abstract class BaseSearchParameters {
  /**
   * 1-based page index.
   */
  page?: number;

  /**
   * Number of items per page.
   */
  perPage?: number;

  protected constructor(params: BaseSearchParametersConstructor) {
    this.page = params.page;
    this.perPage = params.perPage;
  }

  /**
   * Gets the request parameters for the search request.
   * @returns A `Record` mapping parameter names to their string values.
   */
  getRequestParameters(): Record<string, string> {
    const parameters: Record<string, string> = {};

    if (this.page !== null && this.page !== undefined && this.page > 0) {
      parameters["page"] = this.page.toString();
    }
    if (this.perPage !== null && this.perPage !== undefined && this.perPage > 0) {
      parameters["per_page"] = this.perPage.toString();
    }

    return parameters;
  }
}
