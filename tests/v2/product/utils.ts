import { BaseResponse, ResponseConstructor } from "@/v2/parsing/index.js";
import { LocalResponse } from "@/v2/index.js";

export async function loadV2Response<R extends BaseResponse>(
  responseClass: ResponseConstructor<R>,
  resourcePath: string
): Promise<R> {
  const localResponse = new LocalResponse(resourcePath);
  await localResponse.init();
  return localResponse.deserializeResponse(responseClass);
}
