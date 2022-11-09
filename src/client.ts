import {
  Base64Input,
  BytesInput,
  InputSource,
  PathInput,
  StreamInput,
  PageOptions,
  UrlInput,
  BufferInput,
} from "./inputs";
import { Response, STANDARD_API_OWNER, StandardEndpoint } from "./api";
import {
  Document,
  DocumentSig,
  ReceiptV4,
  ReceiptV3,
  CropperV1,
  PassportV1,
  InvoiceV3,
  FinancialDocumentV1,
  fr,
  us,
} from "./documents";
import {
  CustomDocConfig,
  DocumentConfig,
  FinancialDocV1Config,
} from "./documents/documentConfig";
import { errorHandler } from "./errors/handler";
import { LOG_LEVELS, logger } from "./logger";
import { ReadStream } from "fs";

type DocConfigs = Map<string[], DocumentConfig<any>>;

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
   * @param documentClass
   * @param params
   */
  async parse<DocType extends Document>(
    documentClass: DocumentSig<DocType>,
    params: PredictOptions = {
      endpointName: "",
      accountName: "",
      fullText: false,
      cropper: false,
      pageOptions: undefined,
    }
  ): Promise<Response<DocType>> {
    // seems like there should be a better way of doing this
    const fullText = params?.fullText !== undefined ? params.fullText : false;
    const cropper = params?.cropper !== undefined ? params.cropper : false;
    const docType: string =
      params.endpointName === undefined || params.endpointName === ""
        ? documentClass.name
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

    return await docConfig.predict({
      inputDoc: this.inputSource,
      includeWords: fullText,
      pageOptions: params.pageOptions,
      cropper: cropper,
    });
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
      [STANDARD_API_OWNER, FinancialDocumentV1.name],
      new FinancialDocV1Config(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, InvoiceV3.name],
      new DocumentConfig(InvoiceV3, [
        new StandardEndpoint("invoices", "3", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, ReceiptV3.name],
      new DocumentConfig(ReceiptV3, [
        new StandardEndpoint("expense_receipts", "3", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, ReceiptV4.name],
      new DocumentConfig(ReceiptV4, [
        new StandardEndpoint("expense_receipts", "4", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, PassportV1.name],
      new DocumentConfig(PassportV1, [
        new StandardEndpoint("passport", "1", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, CropperV1.name],
      new DocumentConfig(CropperV1, [
        new StandardEndpoint("cropper", "1", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, fr.IdCardV1.name],
      new DocumentConfig(fr.IdCardV1, [
        new StandardEndpoint("idcard_fr", "1", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, us.BankCheckV1.name],
      new DocumentConfig(us.BankCheckV1, [
        new StandardEndpoint("bank_check", "1", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, fr.BankAccountDetailsV1.name],
      new DocumentConfig(fr.BankAccountDetailsV1, [
        new StandardEndpoint("bank_account_details", "1", this.apiKey),
      ])
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

  /**
   * Load an input document from a Buffer.
   * @param buffer
   * @param filename
   */
  docFromBuffer(buffer: Buffer, filename: string) {
    const doc = new BufferInput({
      buffer: buffer,
      filename: filename,
    });
    return new DocumentClient(doc, this.docConfigs);
  }
}
