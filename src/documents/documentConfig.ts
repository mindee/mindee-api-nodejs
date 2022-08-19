import { Input } from "../inputs";
import {
  Response,
  Endpoint,
  InvoiceEndpoint,
  CustomEndpoint,
  PassportEndpoint,
  ReceiptEndpoint,
  API_KEY_ENVVAR_NAME,
} from "../api";
import {
  DOC_TYPE_FINANCIAL,
  DOC_TYPE_INVOICE,
  DOC_TYPE_PASSPORT,
  DOC_TYPE_RECEIPT,
  Document,
} from "./index";
import { errorHandler } from "../errors/handler";
import { ResponseProps } from "../api/response";

interface CustomDocConstructor {
  endpointName: string;
  accountName: string;
  version: string;
  apiKey: string;
}

export type responseSig<RespType> = {
  new ({ httpResponse, documentType, input, error }: ResponseProps): RespType;
};

export class DocumentConfig {
  documentType: string;
  endpoints: Array<Endpoint>;

  constructor(documentType: string, endpoints: Array<Endpoint>) {
    this.documentType = documentType;
    this.endpoints = endpoints;
  }

  async predictRequest(inputDoc: Input, includeWords = false) {
    return await this.endpoints[0].predictRequest(inputDoc, includeWords);
  }

  buildResult<RespType extends Response<Document>>(
    responseType: responseSig<RespType>,
    inputFile: Input,
    response: any
  ): RespType {
    if (response.statusCode > 201) {
      const errorMessage = JSON.stringify(response.data, null, 4);
      errorHandler.throw(
        new Error(
          `${this.endpoints[0].urlName} API ${response.statusCode} HTTP error: ${errorMessage}`
        )
      );
      return new responseType({
        httpResponse: response,
        documentType: this.documentType,
        input: inputFile,
        error: true,
      });
    }
    return new responseType({
      httpResponse: response,
      documentType: this.documentType,
      input: inputFile,
      error: false,
    });
  }

  async predict<RespType extends Response<Document>>(
    responseType: responseSig<RespType>,
    params: { inputDoc: Input; includeWords: boolean; cutPages: boolean }
  ): Promise<RespType> {
    this.checkApiKeys();
    await params.inputDoc.init();
    await this.cutDocPages(params.inputDoc, params.cutPages);
    const response = await this.predictRequest(
      params.inputDoc,
      params.includeWords
    );
    return this.buildResult(responseType, params.inputDoc, response);
  }

  async cutDocPages(inputDoc: Input, cutPages: boolean) {
    if (cutPages && inputDoc.isPdf()) {
      await inputDoc.cutPdf();
    }
  }

  protected checkApiKeys() {
    this.endpoints.forEach((endpoint) => {
      if (!endpoint.apiKey) {
        throw new Error(
          `Missing API key for '${endpoint.keyName}', check your Client configuration.
You can set this using the '${API_KEY_ENVVAR_NAME}' environment variable.\n`
        );
      }
    });
  }
}

export class InvoiceConfig extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new InvoiceEndpoint(apiKey)];
    super(DOC_TYPE_INVOICE, endpoints);
  }
}

export class ReceiptConfig extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new ReceiptEndpoint(apiKey)];
    super(DOC_TYPE_RECEIPT, endpoints);
  }
}

export class FinancialDocConfig extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [
      new InvoiceEndpoint(apiKey),
      new ReceiptEndpoint(apiKey),
    ];
    super(DOC_TYPE_FINANCIAL, endpoints);
  }

  async predictRequest(inputDoc: Input, includeWords = false) {
    let endpoint: Endpoint;
    if (inputDoc.isPdf()) {
      endpoint = this.endpoints[0];
    } else {
      endpoint = this.endpoints[1];
    }
    return await endpoint.predictRequest(inputDoc, includeWords);
  }
}

export class PassportConfig extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new PassportEndpoint(apiKey)];
    super(DOC_TYPE_PASSPORT, endpoints);
  }
}

export class CustomDocConfig extends DocumentConfig {
  constructor({
    endpointName,
    accountName,
    version,
    apiKey,
  }: CustomDocConstructor) {
    const endpoints = [
      new CustomEndpoint(endpointName, accountName, version, apiKey),
    ];
    super(endpointName, endpoints);
  }
}
