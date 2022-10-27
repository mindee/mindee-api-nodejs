import {
  Base64Input,
  BytesInput,
  InputSource,
  PathInput,
  StreamInput,
  PageOptions,
  UrlInput,
} from "./inputs";
import { Response, STANDARD_API_OWNER } from "./api";
import {
  DOC_TYPE_CROPPER_V1,
  DOC_TYPE_FINANCIAL_V1,
  DOC_TYPE_INVOICE_V3,
  DOC_TYPE_PASSPORT_V1,
  DOC_TYPE_RECEIPT_V3,
  DOC_TYPE_RECEIPT_V4,
  Document,
} from "./documents";
import {
  CropperV1Config,
  CustomDocConfig,
  DocumentConfig,
  FinancialDocV1Config,
  InvoiceV3Config,
  PassportV1Config,
  ReceiptV3Config,
  ReceiptV4Config,
  responseSig,
} from "./documents/documentConfig";
import { errorHandler } from "./errors/handler";
import { LOG_LEVELS, logger } from "./logger";
import { ReadStream } from "fs";
import { ProductConfigs } from "./constants";

type DocConfigs = Map<string[], DocumentConfig>;

interface PredictOptions {
  endpointName?: string;
  accountName?: string;
  fullText?: boolean;
  cropper?: boolean;
  pageOptions?: PageOptions;
}

class DocumentClient {
  inputSource: InputSource;
  docConfigs: DocConfigs;

  constructor(inputSource: InputSource, docConfigs: DocConfigs) {
    this.inputSource = inputSource;
    this.docConfigs = docConfigs;
  }

  /**
   * Send a document to an endpoint and parse the predictions.
   * @param responseClass
   * @param params
   */
  async parse<RespType extends Response<Document>>(
    responseClass: responseSig<RespType>,
    params: PredictOptions = {
      endpointName: "",
      accountName: "",
      fullText: false,
      cropper: false,
      pageOptions: undefined,
    }
  ): Promise<RespType> {
    // seems like there should be a better way of doing this
    const fullText = params?.fullText !== undefined ? params.fullText : false;
    const cropper = params?.cropper !== undefined ? params.cropper : false;
    const docType: string =
      params.endpointName === undefined || params.endpointName === ""
        ? this.getDocType(responseClass.name)
        : params.endpointName;

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
    } else if (params.accountName) {
      configKey = [params.accountName, docType];
    }
    const docConfig = this.docConfigs.get(configKey);
    if (docConfig === undefined) {
      // TODO: raise error printing all usernames
      throw `Couldn't find the config '${configKey}'`;
    }

    return await docConfig.predict(responseClass, {
      inputDoc: this.inputSource,
      includeWords: fullText,
      pageOptions: params.pageOptions,
      cropper: cropper,
    });
  }

  protected getDocType(responseClass: string): string {
    return ProductConfigs.getByResponseClassName(responseClass).docType;
  }
}

interface customConfigParams {
  accountName: string;
  endpointName: string;
  version?: string;
}

interface ClientOptions {
  apiKey?: string;
  throwOnError?: boolean;
  debug?: boolean;
}

/**
 * Mindee Client
 */
export class Client {
  readonly docConfigs: DocConfigs;
  protected apiKey: string;

  /**
   * @param options
   */
  constructor(options?: ClientOptions) {
    const throwOnError =
      options?.throwOnError === undefined ? true : options.throwOnError;
    const debug = options?.debug === undefined ? false : options.debug;
    this.apiKey = options?.apiKey === undefined ? "" : options.apiKey;
    this.docConfigs = new Map();

    errorHandler.throwOnError = throwOnError;
    logger.level =
      debug ?? process.env.MINDEE_DEBUG
        ? LOG_LEVELS["debug"]
        : LOG_LEVELS["warn"];
    logger.debug("Client initialized");

    this.addStandardEndpoints();
  }

  // TODO: init only those endpoints we actually need.
  protected addStandardEndpoints() {
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_INVOICE_V3],
      new InvoiceV3Config(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_RECEIPT_V3],
      new ReceiptV3Config(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_RECEIPT_V4],
      new ReceiptV4Config(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_FINANCIAL_V1],
      new FinancialDocV1Config(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_PASSPORT_V1],
      new PassportV1Config(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_CROPPER_V1],
      new CropperV1Config(this.apiKey)
    );
  }

  /**
   * Add a custom endpoint to the client.
   * @param accountName
   * @param endpointName
   * @param version
   */
  addEndpoint({
    accountName,
    endpointName,
    version = "1",
  }: customConfigParams) {
    this.docConfigs.set(
      [accountName, endpointName],
      new CustomDocConfig({
        accountName: accountName,
        endpointName: endpointName,
        version: version,
        apiKey: this.apiKey,
      })
    );
    return this;
  }

  /**
   * Load an input document from a local path.
   * @param inputPath
   */
  docFromPath(inputPath: string) {
    const doc = new PathInput({
      inputPath: inputPath,
    });
    return new DocumentClient(doc, this.docConfigs);
  }

  /**
   * Load an input document from a base64 encoded string.
   * @param inputString
   * @param filename
   */
  docFromBase64(inputString: string, filename: string) {
    const doc = new Base64Input({
      inputString: inputString,
      filename: filename,
    });
    return new DocumentClient(doc, this.docConfigs);
  }

  /**
   * Load an input document from a `ReadStream`.
   * @param inputStream
   * @param filename
   */
  docFromStream(inputStream: ReadStream, filename: string) {
    const doc = new StreamInput({
      inputStream: inputStream,
      filename: filename,
    });
    return new DocumentClient(doc, this.docConfigs);
  }

  /**
   * Load an input document from a bytes string.
   * @param inputBytes
   * @param filename
   */
  docFromBytes(inputBytes: string, filename: string) {
    const doc = new BytesInput({
      inputBytes: inputBytes,
      filename: filename,
    });
    return new DocumentClient(doc, this.docConfigs);
  }

  /**
   * Load an input document from a URL.
   * @param url
   */
  docFromUrl(url: string) {
    const doc = new UrlInput({
      url: url,
    });
    return new DocumentClient(doc, this.docConfigs);
  }
}
