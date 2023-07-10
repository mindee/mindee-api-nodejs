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
  Response,
  AsyncPredictResponse,
  EndpointResponse,
  Endpoint
} from "./http";
import { CustomV1 } from "./product";
import { Document, DocumentSig, Inference } from "./parsing/common";
import { errorHandler } from "./errors/handler";
import { LOG_LEVELS, logger } from "./logger";
import { LocalInputSource } from "./input/base";

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
    async parse<DocType extends Document>(
      inputSource: InputSource,
      documentClass: DocumentSig<DocType>,
      params: PredictOptions = {
        endpointName: "",
        accountName: "",
        fullText: false,
        cropper: false,
        pageOptions: undefined,
      }
    ): Promise<Response<DocType>> {
      const docConfig = this.getDocConfig(
        documentClass,
        params.endpointName,
        params.accountName
      );
      if (inputSource === undefined) {
        throw new Error("The 'parse' function requires an input document.");
      }
      const rawPrediction = await docConfig.predict({
        inputDoc: inputSource,
        includeWords: this.getBooleanParam(params.fullText),
        pageOptions: params.pageOptions,
        cropper: this.getBooleanParam(params.cropper),
      });
  
      return this.#buildResult(rawPrediction);
    }
  
    /**
     * Send the document to an asynchronous endpoint and return its ID in the queue.
     * @param documentClass
     * @param params
     */
    async enqueue<DocType extends Document>(
      inputSource: InputSource,
      documentClass: DocumentSig<DocType>,
      params: PredictOptions = {
        endpointName: "",
        accountName: "",
        fullText: false,
        cropper: false,
        pageOptions: undefined,
      }
    ): Promise<AsyncPredictResponse<DocType>> {
      const docConfig = this.getDocConfig(
        documentClass,
        params.endpointName,
        params.accountName
      );
      if (inputSource === undefined) {
        throw new Error("The 'enqueue' function requires an input document.");
      }
      return await docConfig.predictAsync({
        inputDoc: inputSource,
        includeWords: this.getBooleanParam(params.fullText),
        pageOptions: params.pageOptions,
        cropper: this.getBooleanParam(params.cropper),
      });
    }
  
    async parseQueued<DocType extends Document>(
      inputSource: InputSource,
      documentClass: DocumentSig<DocType>,
      queueId: string,
      endpointIn?: Endpoint,
    ): Promise<AsyncPredictResponse<DocType>> {
      const endpoint: Endpoint = endpointIn ?? this.#initializeEndpoint(documentClass);
      const docResponse = await endpoint.getQueuedDocument(queueId);
      const document = this.buildResult(docResponse);
      return new AsyncPredictResponse(docResponse.data, document);
  
      return;
    }
  
    protected getBooleanParam(param?: boolean): boolean {
      return param !== undefined ? param : false;
    }
  
    protected getDocConfig<DocType extends Document>(
      documentClass: DocumentSig<DocType>,
      endpointName?: string,
      accountName?: string
    ): DocumentConfig<DocType> {
      const docType: string =
        endpointName === undefined || endpointName === ""
          ? documentClass.name
          : endpointName;
  
      const found: Array<string[]> = [];
      this.docConfigs.forEach((config, configKey) => {
        if (configKey[1] === docType) {
          found.push(configKey);
        }
      });
      if (found.length === 0) {
        throw `Document type not configured: '${docType}'`;
      }
  
      let configKey: string[] = [];
      if (found.length === 1) {
        configKey = found[0];
      } else if (accountName) {
        configKey = [accountName, docType];
      }
      const docConfig = this.docConfigs.get(configKey);
      if (docConfig === undefined) {
        // TODO: raise error printing all usernames
        throw `Couldn't find the config '${configKey}'`;
      }
      return docConfig;
    }
  
  
    /**
     * Creates an endpoint with the given values. Raises an error if the endpoint is invalid.
     * @param documentClass
     * @param endpointName
     * @param accountName
     * @param version
     */
    #initializeEndpoint(
      documentClass: typeof Inference,
      endpointName?: string,
      accountName?: string,
      version?: string
    ): Endpoint {
      if ((!endpointName || endpointName.length === 0) && documentClass.constructor.name === "custom") {
        throw new Error("Missing argument endpointName when using a custom class");
      }
  
      endpointName ??= documentClass.endpointName ;
      endpointVersion ??= documentClass.endpointVersion;
      
      return endpoint
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

  #buildResult<DocType extends Document>(
    documentClass:DocumentSig<DocType>,
    response: EndpointResponse,
    inputFile?: InputSource
  ): Response<DocType> {
    const statusCode = response.messageObj.statusCode;
    return new Response<DocType>(documentClass, {
      httpResponse: response,
      documentType: documentType,
      error: false,
      input: inputFile,
    });
  }
}
