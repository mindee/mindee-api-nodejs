import { logger } from "@/logger.js";
import { request, Dispatcher } from "undici";
import { InputSource, PageOptions, LocalInputSource } from "@/input/index.js";

export const TIMEOUT_DEFAULT: number = 120;

export interface RequestOptions {
  hostname: string;
  path: string;
  method: any;
  timeout: number;
  headers: any;
  body?: any;
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
 * @returns the processed request.
 */
export async function sendRequestAndReadResponse(
  dispatcher: Dispatcher,
  options: RequestOptions,
): Promise<BaseHttpResponse> {
  const url: string = `https://${options.hostname}${options.path}`;
  logger.debug(`${options.method}: ${url}`);

  const response = await request(
    url,
    {
      method: options.method,
      headers: options.headers,
      bodyTimeout: options.timeout,
      body: options.body,
      throwOnError: false,
      dispatcher: dispatcher
    }
  );
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
