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

/**
 * Options relating to predictions.
 */
export interface PredictOptions {
  /** A custom endpoint. */
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
  /** 
   * If set, remove pages from the document as specified. 
   * This is done before sending the file to the server and is useful to avoid page limitations.
   */
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
 * Mindee Client class that centralizes most basic operations.
 * 
 * @category Client
 */
export class Client {
  /** Key of the API. */
  protected apiKey: string;

  /**
   * @param options options for the initialization of a client. 
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
   * 
   * @param productClass product class to use for calling  the API and parsing the response. Mandatory to retrieve default OTS endpoint data.
   * @param inputSource document to parse.
   * @param params parameters relating to prediction options.
   * 
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Synchronous
   * @returns a `Promise` containing parsing results.
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
   * @param productClass product class to use for calling  the API and parsing the response.
   * @param params parameters relating to prediction options.
   * @category Asynchronous
   * 
   * @returns a `Promise` containing the job (queue) corresponding to a document.
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

  /**
   * Polls a queue and returns its status as well as the prediction results if the parsing is done.
   * 
   * @param productClass product class to use for calling  the API and parsing the response.
   * @param queueId id of the queue to poll.
   * @param params parameters relating to prediction options.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * @category Asynchronous
   * 
   * @returns a `Promise` containing a `Job`, which also contains a `Document` if the
   * parsing is complete.
   */
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

  /**
   * Forces boolean coercion on truthy/falsy parameters.
   * @param param input parameter to check.
   * @returns a strict boolean value.
   */
  protected getBooleanParam(param?: boolean): boolean {
    return param !== undefined ? param : false;
  }

  /**
   * Builds a custom endpoint.
   * @param endpointName name of the endpoint.
   * @param accountName name of the endpoint's owner.
   * @param endpointVersion version of the endpoint.
   * @returns a custom `Endpoint` object.
   */
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
   * @param productClass product class to use for calling the API and parsing the response.
   * @param endpointName Name of the custom Endpoint.
   * @param accountName Name of the account tied to the Endpoint.
   * @param version Version of the custom Endpoint.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * 
   * @returns a new endpoint
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
   * @param productClass product class to use for calling  the API and parsing the response.
   * @param accountName name of the account's holder. Only required on custom builds.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * 
   * @returns the name of the account. Sends an error if one isn't provided for a custom build.
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
   * @param productClass product class to use for calling  the API and parsing the response. Mandatory to retrieve default OTS endpoint data.
   * @typeParam T an extension of an `Inference`. Can be omitted as it will be inferred from the `productClass`.
   * 
   * @returns an endpoint's name and version.
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
   * @param inputString input content, as a string.
   * @param filename file name.
   */
  docFromBase64(inputString: string, filename: string): InputSource {
    return new Base64Input({
      inputString: inputString,
      filename: filename,
    });
  }

  /**
   * Load an input document from a `stream.Readable` object.
   * @param inputStream input content, as a readable stream.
   * @param filename file name.
   */
  docFromStream(inputStream: Readable, filename: string): InputSource {
    return new StreamInput({
      inputStream: inputStream,
      filename: filename,
    });
  }

  /**
   * Load an input document from a bytes string.
   * @param inputBytes input content, as readable bytes.
   * @param filename file name.
   */
  docFromBytes(inputBytes: string, filename: string): InputSource {
    return new BytesInput({
      inputBytes: inputBytes,
      filename: filename,
    });
  }

  /**
   * Load an input document from a URL.
   * @param url input url. Must be HTTPS.
   */
  docFromUrl(url: string): InputSource {
    return new UrlInput({
      url: url,
    });
  }

  /**
   * Load an input document from a Buffer.
   * @param buffer input content, as a buffer.
   * @param filename file name.
   */
  docFromBuffer(buffer: Buffer, filename: string): InputSource {
    return new BufferInput({
      buffer: buffer,
      filename: filename,
    });
  }
}
