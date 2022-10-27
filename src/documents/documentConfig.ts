import { InputSource } from "../inputs";
import {
  Response,
  Endpoint,
  CustomEndpoint,
  StandardEndpoint,
  predictResponse,
  API_KEY_ENVVAR_NAME,
} from "../api";
import {
  DOC_TYPE_CROPPER_V1,
  DOC_TYPE_FINANCIAL_V1,
  DOC_TYPE_INVOICE_V3,
  DOC_TYPE_PASSPORT_V1,
  DOC_TYPE_RECEIPT_V3,
  DOC_TYPE_RECEIPT_V4,
  Document,
} from "./index";
import { errorHandler } from "../errors/handler";
import { ResponseProps } from "../api/response";
import { PageOptions } from "../inputs";

interface CustomDocConstructor {
  endpointName: string;
  accountName: string;
  version: string;
  apiKey: string;
}

export type responseSig<RespType extends Response<Document>> = {
  new ({ httpResponse, documentType, input, error }: ResponseProps): RespType;
};

export class DocumentConfig {
  readonly documentType: string;
  readonly endpoints: Array<Endpoint>;

  constructor(documentType: string, endpoints: Array<Endpoint>) {
    this.documentType = documentType;
    this.endpoints = endpoints;
  }

  async predictRequest(
    inputDoc: InputSource,
    includeWords: boolean,
    cropping: boolean
  ) {
    return await this.endpoints[0].predictReqPost(
      inputDoc,
      includeWords,
      cropping
    );
  }

  buildResult<RespType extends Response<Document>>(
    responseType: responseSig<RespType>,
    inputFile: InputSource,
    response: predictResponse
  ): RespType {
    const statusCode = response.messageObj.statusCode;
    if (statusCode === undefined || statusCode > 201) {
      const errorMessage = JSON.stringify(response.data, null, 2);
      errorHandler.throw(
        new Error(
          `${this.endpoints[0].urlName} API ${statusCode} HTTP error: ${errorMessage}`
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
    params: {
      inputDoc: InputSource;
      includeWords: boolean;
      pageOptions?: PageOptions;
      cropper: boolean;
    }
  ): Promise<RespType> {
    this.checkApiKeys();
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await this.cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.predictRequest(
      params.inputDoc,
      params.includeWords,
      params.cropper
    );
    return this.buildResult(responseType, params.inputDoc, response);
  }

  async cutDocPages(inputDoc: InputSource, pageOptions: PageOptions) {
    if (inputDoc.isPdf()) {
      await inputDoc.cutPdf(pageOptions);
    }
  }

  protected checkApiKeys() {
    this.endpoints.forEach((endpoint) => {
      if (!endpoint.apiKey) {
        throw new Error(
          `Missing API key for '${this.documentType}', check your Client configuration.
You can set this using the '${API_KEY_ENVVAR_NAME}' environment variable.\n`
        );
      }
    });
  }
}

export class InvoiceV3Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new StandardEndpoint("invoices", "3", apiKey)];
    super(DOC_TYPE_INVOICE_V3, endpoints);
  }
}

export class ReceiptV3Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new StandardEndpoint("expense_receipts", "3", apiKey)];
    super(DOC_TYPE_RECEIPT_V3, endpoints);
  }
}

export class ReceiptV4Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new StandardEndpoint("expense_receipts", "4", apiKey)];
    super(DOC_TYPE_RECEIPT_V4, endpoints);
  }
}

export class FinancialDocV1Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [
      new StandardEndpoint("invoices", "3", apiKey),
      new StandardEndpoint("expense_receipts", "3", apiKey),
    ];
    super(DOC_TYPE_FINANCIAL_V1, endpoints);
  }

  async predictRequest(
    inputDoc: InputSource,
    includeWords: boolean,
    cropping: boolean
  ) {
    let endpoint: Endpoint;
    if (inputDoc.isPdf()) {
      endpoint = this.endpoints[0];
    } else {
      endpoint = this.endpoints[1];
    }
    return await endpoint.predictReqPost(inputDoc, includeWords, cropping);
  }
}

export class PassportV1Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new StandardEndpoint("passport", "1", apiKey)];
    super(DOC_TYPE_PASSPORT_V1, endpoints);
  }
}

export class CropperV1Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new StandardEndpoint("cropper", "1", apiKey)];
    super(DOC_TYPE_CROPPER_V1, endpoints);
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
