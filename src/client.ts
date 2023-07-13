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
import {
  Endpoint
} from "./http";
import {
  Inference,
  AsyncPredictResponse,
  StringDict,
  PredictResponse
} from "./parsing/common";
import { errorHandler } from "./errors/handler";
import { LOG_LEVELS, logger } from "./logger";

/** Empty Product object to access properties on dynamic classes. */
const dummyProduct = {
  "document": {
    "inference": {
      "prediction": {}
    }
  },
  "is_rotation_applied": null,
  "product":
  {
    "name": "N/A",
    "version": "N/A"
  }
};

export interface PredictOptions {
  /**
   * For custom endpoints, the "API name" field in the "Settings" page of the API Builder.
   *
   * Do not set for standard (off the shelf) endpoints.
   */
  endpointName?: string;
  /**
   * For custom endpoints, your account or organization's username on the API Builder.
   * This is normally not required unless you have a custom endpoint which has the
   * same name as standard (off the shelf) endpoint.
   *
   * Do not set for standard (off the shelf) endpoints.
   */
  accountName?: string;
  /**
   * For custom endpoints, your product version.
   * This should have a minimum value of '1', and should be left empty if you are not sure.
   * 
   * Do not set for standard (off the shelf) endpoints.
   */
  version?: string;
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
  /**
   * If set, remove pages from the document as specified.
   *
   * This is done before sending the file to the server and is useful to avoid page limitations.
   */
  pageOptions?: PageOptions;
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
  constructor({
    apiKey = "",
    throwOnError = true,
    debug = false,
  }: ClientOptions) {
    this.apiKey = apiKey;
    errorHandler.throwOnError = throwOnError;
    logger.level =
      debug ?? process.env.MINDEE_DEBUG
        ? LOG_LEVELS["debug"]
        : LOG_LEVELS["warn"];
    logger.debug("Client initialized");
  }

  /**
   * Send a document to a synchronous endpoint and parse the predictions.
   * @param documentClass
   * @param params
   */
  async parse<T extends Inference>(
    inputSource: InputSource,
    documentClass: new (httpResponse: StringDict) => T,
    params: PredictOptions = {
      endpointName: undefined,
      accountName: undefined,
      version: undefined,
      fullText: undefined,
      cropper: undefined,
      pageOptions: undefined,
    }
  ): Promise<PredictResponse<T>> {
    const endpoint = this.#initializeEndpoint<T>(documentClass, params?.endpointName, params?.accountName, params?.version);
    if (inputSource === undefined) {
      throw new Error("The 'parse' function requires an input document.");
    }
    const rawPrediction = await endpoint.predict({
      inputDoc: inputSource,
      includeWords: this.getBooleanParam(params.fullText),
      pageOptions: params.pageOptions,
      cropper: this.getBooleanParam(params.cropper),
    });
    return new PredictResponse<T>(documentClass, rawPrediction.data);
  }

  /**
   * Send the document to an asynchronous endpoint and return its ID in the queue.
   * @param documentClass
   * @param params
   */
  async enqueue<T extends Inference>(
    inputSource: InputSource,
    documentClass: new (httpResponse: StringDict) => T,
    params: PredictOptions = {
      endpointName: "",
      accountName: "",
      fullText: false,
      cropper: false,
      pageOptions: undefined,
    }
  ): Promise<AsyncPredictResponse<T>> {
    const endpoint = this.#initializeEndpoint<T>(documentClass, params?.endpointName, params?.accountName, params?.version);
    if (inputSource === undefined) {
      throw new Error("The 'parse' function requires an input document.");
    }
    const rawResponse = await endpoint.predictAsync({
      inputDoc: inputSource,
      includeWords: this.getBooleanParam(params.fullText),
      pageOptions: params.pageOptions,
      cropper: this.getBooleanParam(params.cropper),
    });

    return new AsyncPredictResponse<T>(documentClass, rawResponse.data);
  }

  async parseQueued<T extends Inference>(
    documentClass: new (httpResponse: StringDict) => T,
    queueId: string,
    endpointIn?: Endpoint,
  ): Promise<AsyncPredictResponse<T>> {
    const endpoint: Endpoint = endpointIn ?? this.#initializeEndpoint(documentClass);
    const docResponse = await endpoint.getQueuedDocument(queueId);
    return new AsyncPredictResponse<T>(documentClass, docResponse.data);

  }

  protected getBooleanParam(param?: boolean): boolean {
    return param !== undefined ? param : false;
  }

  /**
   * Creates an endpoint with the given values. Raises an error if the endpoint is invalid.
   * @param documentClass
   * @param endpointName
   * @param accountName
   * @param version
   */
  #initializeEndpoint<T extends Inference>(
    documentClass: new (httpResponse: StringDict) => T,
    endpointName?: string,
    accountName?: string,
    endpointVersion?: string
  ): Endpoint {
    [endpointName, accountName, endpointVersion] = this.#sanitizeEndpointParams<T>(documentClass, endpointName, accountName, endpointVersion);
    return new Endpoint(accountName, endpointName, endpointVersion, this.apiKey);
  }

  #sanitizeEndpointParams<T extends Inference>(documentClass: new (httpResponse: StringDict) => T, endpointName?: string, accountName?: string, endpointVersion?: string) {
    const dummyObject: T = (new documentClass(dummyProduct) as T);
    if (dummyObject.endpointName !== "custom") {
      if (endpointName) {
        throw new Error(`Unknown product "${documentClass ? documentClass.name : ''}"`);
      }
      endpointName = dummyObject.endpointName;
      endpointVersion = dummyObject.endpointVersion;
    }
    endpointVersion ??= "1";
    if ((!endpointName || endpointName.length === 0)) {
      throw new Error("Missing argument endpointName when using a custom class");
    }
    if (!accountName || accountName.length === 0) {
      accountName = "mindee";
    }
    return [endpointName, accountName, endpointVersion];
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
