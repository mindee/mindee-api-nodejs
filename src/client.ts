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
import { CustomV1 } from "./product";

export interface PredictOptions {
  endpointName?: string;
  accountName?: string;
  endpointVersion?: string;
  endpoint?: Endpoint;
  /**
   * Whether to include the full text for each page.
   *
   * This performs a full OCR operation on the server and will increase response time.
   */
  allWords?: boolean;
  /**
   * Whether to include cropper results for each page.
   *
   * This performs a cropping operation on the server and will increase response time.
   */
  cropper?: boolean;
  pageOptions?: PageOptions;
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
    params: PredictOptions = {
      endpoint: undefined,
      allWords: undefined,
      cropper: undefined,
      pageOptions: undefined,
    }
  ): Promise<PredictResponse<T>> {
    const endpoint =
      params?.endpoint ?? this.#initializeOTSEndpoint<T>(productClass);
    if (inputSource === undefined) {
      throw new Error("The 'parse' function requires an input document.");
    }
    const rawPrediction = await endpoint.predict({
      inputDoc: inputSource,
      includeWords: this.getBooleanParam(params.allWords),
      pageOptions: params.pageOptions,
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
    params: PredictOptions = {}
  ): Promise<AsyncPredictResponse<T>> {
    const endpoint =
      params?.endpoint ?? this.#initializeOTSEndpoint<T>(productClass);
    if (inputSource === undefined) {
      throw new Error("The 'parse' function requires an input document.");
    }
    const rawResponse = await endpoint.predictAsync({
      inputDoc: inputSource,
      includeWords: this.getBooleanParam(params.allWords),
      pageOptions: params?.pageOptions,
      cropper: this.getBooleanParam(params.cropper),
    });

    return new AsyncPredictResponse<T>(productClass, rawResponse.data);
  }

  async parseQueued<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T,
    queueId: string,
    params: PredictOptions = {}
  ): Promise<AsyncPredictResponse<T>> {
    const endpoint =
      params?.endpoint ?? this.#initializeOTSEndpoint(productClass);
    const docResponse = await endpoint.getQueuedDocument(queueId);
    return new AsyncPredictResponse<T>(productClass, docResponse.data);
  }

  protected getBooleanParam(param?: boolean): boolean {
    return param !== undefined ? param : false;
  }

  #buildEndpoint(
    endpointName: string,
    accountName: string,
    endpointVersion: string
  ): Endpoint {
    const apiSettings = new MindeeApi({
      apiKey: this.apiKey,
      urlName: endpointName,
      version: endpointVersion,
      owner: accountName,
    });
    return new Endpoint(
      endpointName,
      accountName,
      endpointVersion,
      apiSettings
    );
  }

  /**
   * Creates a custom endpoint with the given values. Raises an error if the endpoint is invalid.
   * @param productClass Class of the product
   * @param endpointName Name of a custom Endpoint
   * @param accountName Name of the account tied to the active Endpoint
   * @param version Version of a custom Endpoint
   */
  createEndpoint(
    endpointName: string,
    accountName: string,
    endpointVersion?: string
  ): Endpoint {
    const cleanAccountName: string = this.#cleanAccountName(
      CustomV1,
      accountName
    );
    if (!endpointName || endpointName.length === 0) {
      throw new Error("Missing parameter 'endpointName' for custom build!");
    }
    let cleanEndpointVersion: string;
    if (!endpointVersion || endpointVersion.length === 0) {
      logger.debug(
        "Warning: No version provided for a custom build, will attempt to poll version 1 by default."
      );
      cleanEndpointVersion = "1";
    } else {
      cleanEndpointVersion = endpointVersion;
    }
    return this.#buildEndpoint(
      endpointName,
      cleanAccountName,
      cleanEndpointVersion
    );
  }

  /**
   * Creates an endpoint for an OTS product. Raises an error if the endpoint is invalid.
   */
  #initializeOTSEndpoint<T extends Inference>(
    productClass: new (httpResponse: StringDict) => T
  ): Endpoint {
    if (productClass.name === "CustomV1") {
      throw new Error("Incorrect parameters for Custom build.");
    }
    const [endpointName, endpointVersion] = this.#getEndpoint<T>(productClass);
    return this.#buildEndpoint(
      endpointName,
      STANDARD_API_OWNER,
      endpointVersion
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
