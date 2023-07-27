import { Readable } from "stream";
import {
  Base64Input,
  BytesInput,
  InputSource,
  PathInput,
  StreamInput,
  PageOptions,
  UrlInput,
  BufferInput,
} from "./input";
import { Endpoint, MindeeApi, STANDARD_API_OWNER } from "./http";
import {
  Inference,
  AsyncPredictResponse,
  StringDict,
  PredictResponse,
} from "./parsing/common";
import { errorHandler } from "./errors/handler";
import { LOG_LEVELS, logger } from "./logger";
import { InferenceFactory } from "./parsing/common/inference";

export interface PredictOptions {
  /**
   * Whether to include the full text for each page.
   *
   * This performs a full OCR operation on the server and will increase response time.
   */
  fullText?: boolean;
  /**
   * Whether to include cropper results for each page.
   *
   * This performs a cropping operation on the server and will increase response time.
   */
  cropper?: boolean;
}

export interface CustomConfigParams {
  /** Your organization's username on the API Builder. */
  accountName: string;
  /** The "API name" field in the "Settings" page of the API Builder. */
  endpointName: string;
  /**
   * If set, locks the version of the model to use.
   * If not set, use the latest version of the model.
   */
  version?: string;
}

export interface ClientOptions {
  /** Your API key for all endpoints. */
  apiKey?: string;
  /** Raise an `Error` on errors. */
  throwOnError?: boolean;
  /** Log debug messages. */
  debug?: boolean;
}

/**
 * Mindee Client
 */
export class Client {
  protected apiKey: string;

  /**
   * @param options
   */
  constructor(
    { apiKey, throwOnError, debug }: ClientOptions = {
      apiKey: "",
      throwOnError: true,
      debug: false,
    }
  ) {
    this.apiKey = apiKey ? apiKey : "";
    errorHandler.throwOnError = throwOnError ?? true;
    logger.level =
      debug ?? process.env.MINDEE_DEBUG
        ? LOG_LEVELS["debug"]
        : LOG_LEVELS["warn"];
    logger.debug("Client initialized");
  }

  /**
   * Send a document to a synchronous endpoint and parse the predictions.
   * @param productClass
   * @param params
   */
  async parse<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T,
    inputSource: InputSource,
    endpointName?: string,
    accountName?: string,
    endpointVersion?: string,
    params: PredictOptions = {
      fullText: undefined,
      cropper: undefined,
    },
    pageOptions?: PageOptions
  ): Promise<PredictResponse<T>> {
    const endpoint = this.#initializeEndpoint<T>(
      productClass,
      endpointName,
      accountName,
      endpointVersion
    );
    if (inputSource === undefined) {
      throw new Error("The 'parse' function requires an input document.");
    }
    const rawPrediction = await endpoint.predict({
      inputDoc: inputSource,
      includeWords: this.getBooleanParam(params.fullText),
      pageOptions: pageOptions,
      cropper: this.getBooleanParam(params.cropper),
    });
    return new PredictResponse<T>(productClass, rawPrediction.data);
  }

  /**
   * Send the document to an asynchronous endpoint and return its ID in the queue.
   * @param productClass
   * @param params
   */
  async enqueue<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T,
    inputSource: InputSource,
    endpointName?: string,
    accountName?: string,
    endpointVersion?: string,
    params: PredictOptions = {
      fullText: false,
      cropper: false,
    },
    pageOptions?: PageOptions
  ): Promise<AsyncPredictResponse<T>> {
    const endpoint = this.#initializeEndpoint<T>(
      productClass,
      endpointName,
      accountName,
      endpointVersion
    );
    if (inputSource === undefined) {
      throw new Error("The 'parse' function requires an input document.");
    }
    const rawResponse = await endpoint.predictAsync({
      inputDoc: inputSource,
      includeWords: this.getBooleanParam(params.fullText),
      pageOptions: pageOptions,
      cropper: this.getBooleanParam(params.cropper),
    });

    return new AsyncPredictResponse<T>(productClass, rawResponse.data);
  }

  async parseQueued<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T,
    queueId: string,
    endpointIn?: Endpoint
  ): Promise<AsyncPredictResponse<T>> {
    const endpoint: Endpoint =
      endpointIn ?? this.#initializeEndpoint(productClass);
    const docResponse = await endpoint.getQueuedDocument(queueId);
    return new AsyncPredictResponse<T>(productClass, docResponse.data);
  }

  protected getBooleanParam(param?: boolean): boolean {
    return param !== undefined ? param : false;
  }

  /**
   * Creates an endpoint with the given values. Raises an error if the endpoint is invalid.
   * @param productClass
   * @param endpointName
   * @param accountName
   * @param version
   */
  #initializeEndpoint<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T,
    endpointName?: string,
    accountName?: string,
    endpointVersion?: string
  ): Endpoint;

  /**
   * Creates an endpoint for an OTS app.
   * @param productClass Class of the product
   */
  #initializeEndpoint<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T
  ): Endpoint;

  /**
   * Creates an endpoint with the given values. Raises an error if the endpoint is invalid.
   * @param productClass Class of the product
   * @param endpointName Name of a custom Endpoint
   * @param accountName Name of the account tied to the active Endpoint
   * @param version Version of a custom Endpoint
   */
  #initializeEndpoint<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T,
    endpointName?: string,
    accountName?: string,
    endpointVersion?: string
  ): Endpoint {
    const cleanAccountName: string = this.#cleanAccountName(
      productClass,
      accountName
    );
    let cleanEndpointName, cleanEndpointVersion: string;
    if (productClass.name === "CustomV1") {
      if (!endpointName || endpointName.length === 0) {
        throw new Error("Missing parameter 'endpointName' for custom build!");
      }
      if (!endpointVersion || endpointVersion.length === 0) {
        logger.debug(
          "Warning: No version provided for a custom build, will attempt to poll version 1 by default."
        );
        endpointVersion = "1";
      }
      [cleanEndpointName, cleanEndpointVersion] = [
        endpointName,
        endpointVersion,
      ];
    } else {
      [cleanEndpointName, cleanEndpointVersion] =
        this.#getEndpoint<T>(productClass);
    }
    const apiSettings = new MindeeApi({
      apiKey: this.apiKey,
      urlName: cleanEndpointName,
      version: cleanEndpointVersion,
      owner: cleanAccountName,
    });
    return new Endpoint(
      cleanEndpointName,
      cleanAccountName,
      cleanEndpointVersion,
      apiSettings
    );
  }

  /**
   * Checks that an account name is provided for custom builds, and sets the default one otherwise.
   * @param productClass Type of product
   * @param accountName Account name. Only required on custom builds.
   * @returns {string} The name of the account. Sends an error if one isn't provided for a custom build.
   */
  #cleanAccountName<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T,
    accountName?: string
  ): string {
    if (productClass.name === "CustomV1") {
      if (!accountName || accountName.length === 0) {
        logger.debug(
          `Warning: no account name provided for custom build, ${STANDARD_API_OWNER} will be used by default`
        );
        return STANDARD_API_OWNER;
      }
      return accountName;
    }
    return STANDARD_API_OWNER;
  }

  /**
   * Get the name and version of an OTS endpoint.
   * @param productClass Type of product
   * @returns {[string, string]} An endpoint's name and version
   */
  #getEndpoint<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T
  ): [string, string] {
    const [endpointName, endpointVersion] =
      InferenceFactory.getEndpoint(productClass);
    return [endpointName, endpointVersion];
  }

  /**
   * Load an input document from a local path.
   * @param inputPath
   */
  docFromPath(inputPath: string): InputSource {
    return new PathInput({
      inputPath: inputPath,
    });
  }

  /**
   * Load an input document from a base64 encoded string.
   * @param inputString
   * @param filename
   */
  docFromBase64(inputString: string, filename: string): InputSource {
    return new Base64Input({
      inputString: inputString,
      filename: filename,
    });
  }

  /**
   * Load an input document from a `stream.Readable` object.
   * @param inputStream
   * @param filename
   */
  docFromStream(inputStream: Readable, filename: string): InputSource {
    return new StreamInput({
      inputStream: inputStream,
      filename: filename,
    });
  }

  /**
   * Load an input document from a bytes string.
   * @param inputBytes
   * @param filename
   */
  docFromBytes(inputBytes: string, filename: string): InputSource {
    return new BytesInput({
      inputBytes: inputBytes,
      filename: filename,
    });
  }

  /**
   * Load an input document from a URL.
   * @param url
   */
  docFromUrl(url: string): InputSource {
    return new UrlInput({
      url: url,
    });
  }

  /**
   * Load an input document from a Buffer.
   * @param buffer
   * @param filename
   */
  docFromBuffer(buffer: Buffer, filename: string): InputSource {
    return new BufferInput({
      buffer: buffer,
      filename: filename,
    });
  }
}
