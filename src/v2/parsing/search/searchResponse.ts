import { StringDict } from "@/parsing/index.js";
import { ModelSearchResponse } from "@/v2/search/models/modelSearchResponse.js";

/**
 * Models search response.
 * @deprecated Use `ModelSearchResponse` instead.
 */
export class SearchResponse extends ModelSearchResponse {
  constructor(serverResponse: StringDict) {
    super(serverResponse);
  }
}
