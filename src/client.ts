import {
  Base64Input,
  BytesInput,
  Input,
  PathInput,
  StreamInput,
} from "./inputs";
import { Response, STANDARD_API_OWNER } from "./api";
import {
  DOC_TYPE_CROPPER,
  DOC_TYPE_FINANCIAL,
  DOC_TYPE_INVOICE,
  DOC_TYPE_PASSPORT,
  DOC_TYPE_RECEIPT,
  Document,
} from "./documents";
import {
  CropperConfig,
  CustomDocConfig,
  DocumentConfig,
  FinancialDocConfig,
  InvoiceConfig,
  PassportConfig,
  ReceiptConfig,
  responseSig,
} from "./documents/documentConfig";
import { errorHandler } from "./errors/handler";
import { LOG_LEVELS, logger } from "./logger";
import { ReadStream } from "fs";
import { ProductConfigs } from "./constants";

type DocConfigs = Map<string[], DocumentConfig>;

interface PredictOptions {
  docType?: string;
  username?: string;
  cutPages?: boolean;
  fullText?: boolean;
  cropper?: boolean;
}

class DocumentClient {
  inputDoc: Input;
  docConfigs: DocConfigs;

  constructor(inputDoc: Input, docConfigs: DocConfigs) {
    this.inputDoc = inputDoc;
    this.docConfigs = docConfigs;
  }

  async parse<RespType extends Response<Document>>(
    responseClass: responseSig<RespType>,
    params: PredictOptions = {
      docType: "",
      username: "",
      cutPages: true,
      fullText: false,
      cropper: false,
    }
  ): Promise<RespType> {
    // seems like there should be a better way of doing this
    const fullText = params?.fullText !== undefined ? params.fullText : false;
    const cropper = params?.cropper !== undefined ? params.cropper : false;
    const cutPages = params?.cutPages !== undefined ? params.cutPages : true;
    const docType: string =
      params.docType === undefined || params.docType === ""
        ? this.getDocType(responseClass.name)
        : params.docType;

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
    } else if (params.username) {
      configKey = [params.username, docType];
    }
    const docConfig = this.docConfigs.get(configKey);
    if (docConfig === undefined) {
      // TODO: raise error printing all usernames
      throw `Couldn't find the config '${configKey}'`;
    }

    return await docConfig.predict(responseClass, {
      inputDoc: this.inputDoc,
      includeWords: fullText,
      cutPages: cutPages,
      cropper: cropper,
    });
  }

  protected getDocType(responseClass: string): string {
    return ProductConfigs.getByResponseClassName(responseClass).docType;
  }
}

interface customConfigParams {
  accountName: string;
  documentType: string;
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
      [STANDARD_API_OWNER, DOC_TYPE_INVOICE],
      new InvoiceConfig(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_RECEIPT],
      new ReceiptConfig(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_FINANCIAL],
      new FinancialDocConfig(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_PASSPORT],
      new PassportConfig(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, DOC_TYPE_CROPPER],
      new CropperConfig(this.apiKey)
    );
  }

  addEndpoint({
    accountName,
    documentType,
    version = "1",
  }: customConfigParams) {
    this.docConfigs.set(
      [accountName, documentType],
      new CustomDocConfig({
        accountName: accountName,
        documentType: documentType,
        version: version,
        apiKey: this.apiKey,
      })
    );
    return this;
  }

  docFromPath(inputPath: string) {
    const doc = new PathInput({
      inputPath: inputPath,
    });
    return new DocumentClient(doc, this.docConfigs);
  }

  docFromBase64(inputString: string, filename: string) {
    const doc = new Base64Input({
      inputString: inputString,
      filename: filename,
    });
    return new DocumentClient(doc, this.docConfigs);
  }

  docFromStream(inputStream: ReadStream, filename: string) {
    const doc = new StreamInput({
      inputStream: inputStream,
      filename: filename,
    });
    return new DocumentClient(doc, this.docConfigs);
  }

  docFromBytes(inputBytes: string, filename: string) {
    const doc = new BytesInput({
      inputBytes: inputBytes,
      filename: filename,
    });
    return new DocumentClient(doc, this.docConfigs);
  }
}
