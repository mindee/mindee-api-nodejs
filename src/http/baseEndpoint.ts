import { ApiSettings } from "./apiSettings.js";
import { logger } from "@/logger.js";
import { IncomingMessage, ClientRequest } from "http";
import { request, RequestOptions } from "https";
import { InputSource, PageOptions, LocalInputSource } from "@/input/index.js";


export interface EndpointResponse {
  messageObj: IncomingMessage;
  data: { [key: string]: any };
}

/**
 * Base endpoint for the Mindee API.
 */
export abstract class BaseEndpoint {
  /** Settings relating to the API. */
  settings: ApiSettings;

  /** Entire root of the URL for API calls. */
  urlRoot: string;

  protected constructor(
    settings: ApiSettings,
    urlRoot: string
  ) {
    this.settings = settings;
    this.urlRoot = urlRoot;
  }

  /**
   * Cuts a document's pages according to the given options.
   * @param inputDoc input document.
   * @param pageOptions page cutting options.
   */
  public static async cutDocPages(inputDoc: InputSource, pageOptions: PageOptions) {
    if (inputDoc instanceof LocalInputSource && inputDoc.isPdf()) {
      await inputDoc.applyPageOptions(pageOptions);
    }
  }

  /**
   * Reads a response from the API and processes it.
   * @param options options related to the request itself.
   * @param resolve the resolved response
   * @param reject promise rejection reason.
   * @returns the processed request.
   */
  public static readResponse(
    options: RequestOptions,
    resolve: (value: EndpointResponse | PromiseLike<EndpointResponse>) => void,
    reject: (reason?: any) => void
  ): ClientRequest {
    logger.debug(
      `${options.method}: https://${options.hostname}${options.path}`
    );

    const req = request(options, function (res: IncomingMessage) {
      // when the encoding is set, data chunks will be strings
      res.setEncoding("utf-8");

      let responseBody = "";
      res.on("data", function (chunk: string) {
        logger.debug("Receiving data ...");
        responseBody += chunk;
      });
      res.on("end", function () {
        logger.debug("Parsing the response ...");
        // handle empty responses from server, for example in the case of redirects
        if (!responseBody) {
          responseBody = "{}";
        }
        try {
          const parsedResponse = JSON.parse(responseBody);
          try {
            resolve({
              messageObj: res,
              data: parsedResponse,
            });
          } catch (error) {
            logger.error("Could not construct the return object.");
            reject(error);
          }
        } catch {
          logger.error("Could not parse the return as JSON.");
          logger.debug(responseBody);
          resolve({
            messageObj: res,
            data: { reconstructedResponse: responseBody },
          });
        }
      });
    });
    req.on("error", (err: any) => {
      reject(err);
    });
    return req;
  }
}
