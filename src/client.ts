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
} from "./inputs";
import {
  Response,
  STANDARD_API_OWNER,
  StandardEndpoint,
  AsyncPredictResponse,
} from "./api";
import {
  Document,
  DocumentSig,
  ReceiptV3,
  ReceiptV4,
  ReceiptV5,
  CropperV1,
  PassportV1,
  MindeeVisionV1,
  InvoiceV3,
  InvoiceV4,
  InvoiceSplitterV1,
  FinancialDocumentV0,
  fr,
  us,
  eu,
  ProofOfAddressV1,
  FinancialDocumentV1,
} from "./documents";
import {
  CustomDocConfig,
  DocumentConfig,
  FinancialDocV0Config,
} from "./documents/documentConfig";
import { errorHandler } from "./errors/handler";
import { LOG_LEVELS, logger } from "./logger";

type DocConfigs = Map<string[], DocumentConfig<any>>;

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

export class DocumentClient {
  docConfigs: DocConfigs;
  inputSource?: InputSource;

  constructor(docConfigs: DocConfigs, inputSource?: InputSource) {
    this.inputSource = inputSource;
    this.docConfigs = docConfigs;
  }

  /**
   * Send a document to a synchronous endpoint and parse the predictions.
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
    const docConfig = this.getDocConfig(
      documentClass,
      params.endpointName,
      params.accountName
    );
    if (this.inputSource === undefined) {
      throw new Error("The 'parse' function requires an input document.");
    }
    return await docConfig.predict({
      inputDoc: this.inputSource,
      includeWords: this.getBooleanParam(params.fullText),
      pageOptions: params.pageOptions,
      cropper: this.getBooleanParam(params.cropper),
    });
  }

  /**
   * Send the document to an asynchronous endpoint and return its ID in the queue.
   * @param documentClass
   * @param params
   */
  async enqueue<DocType extends Document>(
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
    if (this.inputSource === undefined) {
      throw new Error("The 'enqueue' function requires an input document.");
    }
    return await docConfig.predictAsync({
      inputDoc: this.inputSource,
      includeWords: this.getBooleanParam(params.fullText),
      pageOptions: params.pageOptions,
      cropper: this.getBooleanParam(params.cropper),
    });
  }

  async parseQueued<DocType extends Document>(
    documentClass: DocumentSig<DocType>,
    queueId: string,
    params: {
      endpointName?: string;
      accountName?: string;
    } = {
      endpointName: "",
      accountName: "",
    }
  ): Promise<AsyncPredictResponse<DocType>> {
    const docConfig = this.getDocConfig(
      documentClass,
      params.endpointName,
      params.accountName
    );
    return await docConfig.getQueuedDocument(queueId);
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
  readonly docConfigs: DocConfigs;
  protected apiKey: string;

  /**
   * @param options
   */
  constructor({
    apiKey = "",
    throwOnError = true,
    debug = false,
  }: ClientOptions) {
    this.docConfigs = new Map();
    this.apiKey = apiKey;
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
      [STANDARD_API_OWNER, FinancialDocumentV0.name],
      new FinancialDocV0Config(this.apiKey)
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, FinancialDocumentV1.name],
      new DocumentConfig(FinancialDocumentV1, [
        new StandardEndpoint("financial_document", "1", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, InvoiceV3.name],
      new DocumentConfig(InvoiceV3, [
        new StandardEndpoint("invoices", "3", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, InvoiceV4.name],
      new DocumentConfig(InvoiceV4, [
        new StandardEndpoint("invoices", "4", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, InvoiceSplitterV1.name],
      new DocumentConfig(InvoiceSplitterV1, [
        new StandardEndpoint("invoice_splitter", "1", this.apiKey),
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
      [STANDARD_API_OWNER, ReceiptV5.name],
      new DocumentConfig(ReceiptV5, [
        new StandardEndpoint("expense_receipts", "5", this.apiKey),
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
    this.docConfigs.set(
      [STANDARD_API_OWNER, fr.CarteVitaleV1.name],
      new DocumentConfig(fr.CarteVitaleV1, [
        new StandardEndpoint("carte_vitale", "1", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, eu.LicensePlateV1.name],
      new DocumentConfig(eu.LicensePlateV1, [
        new StandardEndpoint("license_plates", "1", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, MindeeVisionV1.name],
      new DocumentConfig(MindeeVisionV1, [
        new StandardEndpoint("mindee_vision", "1", this.apiKey),
      ])
    );
    this.docConfigs.set(
      [STANDARD_API_OWNER, ProofOfAddressV1.name],
      new DocumentConfig(ProofOfAddressV1, [
        new StandardEndpoint("proof_of_address", "1", this.apiKey),
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
  }: CustomConfigParams) {
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
    return new DocumentClient(this.docConfigs, doc);
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
    return new DocumentClient(this.docConfigs, doc);
  }

  /**
   * Load an input document from a `stream.Readable` object.
   * @param inputStream
   * @param filename
   */
  docFromStream(inputStream: Readable, filename: string) {
    const doc = new StreamInput({
      inputStream: inputStream,
      filename: filename,
    });
    return new DocumentClient(this.docConfigs, doc);
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
    return new DocumentClient(this.docConfigs, doc);
  }

  /**
   * Load an input document from a URL.
   * @param url
   */
  docFromUrl(url: string) {
    const doc = new UrlInput({
      url: url,
    });
    return new DocumentClient(this.docConfigs, doc);
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
    return new DocumentClient(this.docConfigs, doc);
  }

  /**
   * Load an empty input document from an asynchronous call.
   */
  docForAsync() {
    return new DocumentClient(this.docConfigs);
  }
}
