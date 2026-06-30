import { logger } from "@/logger.js";
import { request, Dispatcher, FormData } from "undici";
import { InputSource, PageOptions, LocalInputSource } from "@/input/index.js";

export const TIMEOUT_SECS_DEFAULT: number = 120;

export interface RequestOptions {
  hostname?: string;
  path?: string;
  method: any;
  timeoutSecs: number;
  headers: any;
  body?: FormData | string;
  queryParams?: Record<string, string>;
}

export interface BaseHttpResponse {
  messageObj: any;
  data: { [key: string]: any };
}

/**
 * Cuts a document's pages according to the given options.
 * @param inputDoc input document.
 * @param pageOptions page cutting options.
 */
export async function cutDocPages(inputDoc: InputSource, pageOptions: PageOptions) {
  if (inputDoc instanceof LocalInputSource && inputDoc.isPdf()) {
    await inputDoc.applyPageOptions(pageOptions);
  }
}

/**
 * Reads a response from the API and processes it.
 * @param dispatcher custom dispatcher to use for the request.
 * @param options options related to the request itself.
 * @param url override the URL of the request.
 * @returns the processed request.
 */
export async function sendRequestAndReadResponse(
  dispatcher: Dispatcher,
  options: RequestOptions,
  url?: string,
): Promise<BaseHttpResponse> {
  const requestUrl = new URL(url ?? `https://${options.hostname}${options.path}`);
  if (options.queryParams) {
    for (const [key, value] of Object.entries(options.queryParams)) {
      requestUrl.searchParams.set(key, value);
    }
  }
  const requestParams = {
    method: options.method,
    headers: options.headers,
    headersTimeout: options.timeoutSecs * 1000,
    body: options.body,
    dispatcher: dispatcher,
  };
  let response: Dispatcher.ResponseData;
  try {
    response = await request(
      requestUrl, requestParams
    );
  } catch (err: any) {
    // shenanigans in networking or freezing/thawing of the process in serverless environments
    if (err.code === "UND_ERR_SOCKET" || err.code === "UND_ERR_CONNECT_TIMEOUT" || err.code === "ECONNRESET") {
      logger.warn(`Socket error (${err.code}), retrying with a fresh connection...`);
      response = await request(requestUrl, requestParams);
    } else throw err;
  }

  logger.debug("Parsing the response ...");

  let responseBody: string = await response.body.text();
  // handle empty responses from server, for example, in the case of redirects
  if (!responseBody) {
    responseBody = "{}";
  }
  try {
    const parsedResponse = JSON.parse(responseBody);
    logger.debug("JSON parsed successfully, returning plain object.");
    return {
      messageObj: response,
      data: parsedResponse,
    };
  } catch {
    logger.error("Could not parse the return as JSON.");
    return {
      messageObj: response,
      data: { reconstructedResponse: responseBody },
    };
  }
}
