import { StringDict } from "@/parsing/stringDict.js";
import { logger } from "@/logger.js";

export abstract class BaseResponse {
  /**
   * Raw text representation of the API's response.
   */
  private readonly rawHttp: StringDict;

  /**
   * @param serverResponse JSON response from the server.
   */
  protected constructor(serverResponse: StringDict) {
    this.rawHttp = serverResponse;
    logger.debug("Constructing response instance from plain object.");
  }

  /**
   * Raw HTTP request sent from server, as a JSON-like structure
   * @returns The HTTP request
   */
  getRawHttp(): StringDict {
    return this.rawHttp;
  }
}

export type ResponseConstructor<T extends BaseResponse> = new (serverResponse: StringDict) => T;
