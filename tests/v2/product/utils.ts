import { BaseResponse, ResponseConstructor } from "@/v2/parsing/index.js";
import { LocalResponse } from "@/v2/index.js";

/**
 * Loads a V2 response from a local file.
 * @param responseClass The class of the response to load.
 * @param resourcePath Path to the local file.
 * @returns The loaded response.
 */
export async function loadV2Response<R extends BaseResponse>(
  responseClass: ResponseConstructor<R>,
  resourcePath: string
): Promise<R> {
  const localResponse = new LocalResponse(resourcePath);
  return localResponse.deserializeResponse(responseClass);
}
