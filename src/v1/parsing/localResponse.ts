import { LocalResponseBase } from "@/parsing/localResponseBase.js";
import { AsyncPredictResponse, Inference, PredictResponse } from "@/v1/index.js";
import { StringDict } from "@/parsing/index.js";
import { MindeeError } from "@/errors/index.js";

/**
 * Local response loaded from a file.
 * Note: Has to be initialized through init() before use.
 */
export class LocalResponse extends LocalResponseBase {
  async loadPrediction<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T
  ) {
    /**
     * Load a prediction.
     *
     * @param productClass Product class to use for calling the API and parsing the response.
     * @param localResponse Local response to load.
     * @category Asynchronous
     * @returns A valid prediction
     */
    try {
      const asDict = await this.asDict();
      if (Object.prototype.hasOwnProperty.call(asDict, "job")) {
        return new AsyncPredictResponse(productClass, asDict);
      }
      return new PredictResponse(productClass, asDict);
    } catch {
      throw new MindeeError("No prediction found in local response.");
    }
  }
}
