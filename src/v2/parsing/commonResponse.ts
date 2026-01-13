import { StringDict } from "@/parsing/stringDict.js";


export abstract class CommonResponse {
  /**
   * Raw text representation of the API's response.
   */
  private readonly rawHttp: StringDict;

  /**
   * @param serverResponse JSON response from the server.
   */
  protected constructor(serverResponse: StringDict) {
    this.rawHttp = serverResponse;
  }

  /**
   * Raw HTTP request sent from server, as a JSON-like structure
   * @returns The HTTP request
   */
  getRawHttp(): StringDict {
    return this.rawHttp;
  }
}
