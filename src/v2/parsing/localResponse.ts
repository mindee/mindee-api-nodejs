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
   * Deserialize the loaded local response into a product response class.
   *
   * Typically used when dealing with V2 webhook callbacks to parse the raw
   * JSON payload pushed to your endpoint into a typed response object.
   *
   * Pass the response class that matches the product you used when enqueuing
   * the document. All product response classes are exported from the `mindee`
   * package and can be used here:
   *
   * - `mindee.product.ExtractionResponse`
   * - `mindee.product.ClassificationResponse`
   * - `mindee.product.OcrResponse`
   * - `mindee.product.CropResponse`
   * - `mindee.product.SplitResponse`
   *
   * @typeParam ResponseT - A class that extends `BaseResponse`.
   * @param responseClass - The constructor of the product response class into
   *   which the payload should be deserialized.
   * @returns An instance of `responseClass` populated with the webhook payload.
   * @throws MindeeError If the provided class cannot be instantiated.
   */
  public async deserializeResponse<ResponseT extends BaseResponse>(
    responseClass: new (serverResponse: StringDict) => ResponseT
  ): Promise<ResponseT> {
    try {
      return new responseClass(await this.asDict());
    } catch (error) {
      console.error(error);
      throw new MindeeError(`Invalid response provided: ${error}`);
    }
  }
}
