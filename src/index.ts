import {
  Input,
  PathInput,
  Base64Input,
  StreamInput,
  BytesInput,
} from "./inputs";
import {
  DOC_TYPE_INVOICE,
  DOC_TYPE_RECEIPT,
  DOC_TYPE_PASSPORT,
  DOC_TYPE_FINANCIAL,
  Document,
} from "./documents";
import {
  DocumentConfig,
  CustomDocConfig,
  FinancialDocConfig,
  InvoiceConfig,
  PassportConfig,
  ReceiptConfig,
  responseSig,
} from "./documents/documentConfig";
import { ReadStream } from "fs";
import { errorHandler } from "./errors/handler";
import { logger, LOG_LEVELS } from "./logger";
import {
  Response,
  FinancialResponse,
  InvoiceResponse,
  PassportResponse,
  ReceiptResponse,
  CustomResponse,
  OTS_OWNER,
} from "./api";

export {
  Response,
  FinancialResponse,
  InvoiceResponse,
  PassportResponse,
  ReceiptResponse,
  CustomResponse,
};

type DocConfigs = Map<string[], DocumentConfig>;

interface PredictOptions {
  docType: string;
  username?: string;
  cutPages?: boolean;
  fullText?: boolean;
}

class DocumentClient {
  inputDoc: Input;
  docConfigs: DocConfigs;

  constructor(inputDoc: Input, docConfigs: any) {
    this.inputDoc = inputDoc;
    this.docConfigs = docConfigs;
  }

  async parse<RespType extends Response<Document>>(
    responseType: responseSig<RespType>,
    params: PredictOptions
  ): Promise<RespType> {
    const found: Array<string[]> = [];
    this.docConfigs.forEach((config, configKey) => {
      if (configKey[1] === params.docType) {
        found.push(configKey);
      }
    });
    if (found.length === 0) {
      throw `Document type not configured: '${params.docType}'`;
    }

    let configKey: string[] = [];
    if (found.length === 1) {
      configKey = found[0];
    } else if (params.username) {
      configKey = [params.username, params.docType];
    }
    const docConfig = this.docConfigs.get(configKey);
    if (docConfig === undefined) {
      // TODO: raise error printing all usernames
      throw `Couldn't find the config '${configKey}'`;
    }

    // seems like there should be a better way of doing this
    const fullText = params?.fullText !== undefined ? params.fullText : false;
    const cutPages = params?.cutPages !== undefined ? params.cutPages : true;

    return await docConfig.predict(responseType, {
      inputDoc: this.inputDoc,
      includeWords: fullText,
      cutPages: cutPages,
    });
  }
}

interface ClientOptions {
  apiKey?: string;
  throwOnError?: boolean;
  debug?: boolean;
}

interface customConfigParams {
  accountName: string;
  endpointName: string;
  version?: string;
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
  }

  configInvoice() {
    this.docConfigs.set(
      [OTS_OWNER, DOC_TYPE_INVOICE],
      new InvoiceConfig(this.apiKey)
    );
    return this;
  }

  configReceipt() {
    this.docConfigs.set(
      [OTS_OWNER, DOC_TYPE_RECEIPT],
      new ReceiptConfig(this.apiKey)
    );
    return this;
  }

  configFinancialDoc() {
    this.docConfigs.set(
      [OTS_OWNER, DOC_TYPE_FINANCIAL],
      new FinancialDocConfig(this.apiKey)
    );
    return this;
  }

  configPassport() {
    this.docConfigs.set(
      [OTS_OWNER, DOC_TYPE_PASSPORT],
      new PassportConfig(this.apiKey)
    );
    return this;
  }

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

exports.Client = Client;
exports.documents = require("./documents");
exports.api = require("./api");
exports.inputs = require("./inputs");
