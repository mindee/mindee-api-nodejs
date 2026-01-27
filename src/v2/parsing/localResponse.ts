import { StringDict } from "@/parsing/stringDict.js";
import { MindeeError } from "@/errors/index.js";
import { LocalResponseBase } from "@/parsing/localResponseBase.js";
import { BaseResponse } from "./baseResponse.js";

/**
 * Local response loaded from a file.
 * Note: Has to be initialized through init() before use.
 */
export class LocalResponse extends LocalResponseBase {

  /**
   * Deserialize the loaded local response into the requested CommonResponse-derived class.
   *
   * Typically used when dealing with V2 webhook callbacks.
   *
   * @typeParam ResponseT - A class that extends `CommonResponse`.
   * @param responseClass - The constructor of the class into which the payload should be deserialized.
   * @returns An instance of `responseClass` populated with the file content.
   * @throws MindeeError If the provided class cannot be instantiated.
   */
  public async deserializeResponse<ResponseT extends BaseResponse>(
    responseClass: new (serverResponse: StringDict) => ResponseT
  ): Promise<ResponseT> {
    try {
      return new responseClass(await this.asDict());
    } catch {
      throw new MindeeError("Invalid response provided.");
    }
  }
}
