import { StringDict } from "@/parsing/index.js";
import { ModelSearchResponse } from "./modelSearchResponse.js";

/**
 * Models search response.
 * @deprecated Use `ModelSearchResponse` instead.
 */
export class SearchResponse extends ModelSearchResponse {
  constructor(serverResponse: StringDict) {
    super(serverResponse);
  }
}
