import { InputSource } from "../input";
import {
  Response,
  Endpoint,
  CustomEndpoint,
  EndpointResponse,
  API_KEY_ENVVAR_NAME,
  AsyncPredictResponse,
} from "../http";
import { CustomV1 } from "../product";
import { errorHandler } from "../errors/handler";
import { PageOptions } from "../input";
import { Document, DocumentSig } from "./common";

interface CustomDocConstructor {
  endpointName: string;
  accountName: string;
  version: string;
  apiKey: string;
}

export class DocumentConfig<DocType extends Document> {
  readonly documentType: string | undefined;
  readonly endpoints: Array<Endpoint>;
  readonly documentClass: DocumentSig<DocType>;

  constructor(
    documentClass: DocumentSig<DocType>,
    endpoints: Array<Endpoint>,
    documentType?: string
  ) {
    this.documentType = documentType;
    this.endpoints = endpoints;
    this.documentClass = documentClass;
  }

  async predict(params: {
    inputDoc: InputSource;
    includeWords: boolean;
    pageOptions?: PageOptions;
    cropper: boolean;
  }): Promise<Response<DocType>> {
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
    return this.buildResult(response, params.inputDoc);
  }

  async predictAsync(params: {
    inputDoc: InputSource;
    includeWords: boolean;
    pageOptions?: PageOptions;
    cropper: boolean;
  }): Promise<AsyncPredictResponse<DocType>> {
    this.checkApiKeys();
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await this.cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.endpoints[0].predictAsyncReqPost(
      params.inputDoc,
      params.includeWords,
      params.cropper
    );
    const statusCode = response.messageObj.statusCode;
    if (statusCode === undefined || statusCode >= 300) {
      this.handleError(response, statusCode);
    }
    return new AsyncPredictResponse(response.data);
  }

  async getQueuedDocument(
    queuId: string
  ): Promise<AsyncPredictResponse<DocType>> {
    this.checkApiKeys();
    const queueResponse = await this.endpoints[0].documentQueueReqGet(queuId);
    const queueStatusCode = queueResponse.messageObj.statusCode;
    if (
      queueStatusCode === undefined ||
      queueStatusCode < 200 ||
      queueStatusCode >= 400
    ) {
      this.handleError(queueResponse, queueStatusCode);
    }
    if (
      queueStatusCode === 302 &&
      queueResponse.messageObj.headers.location !== undefined
    ) {
      const docId = queueResponse.messageObj.headers.location.split("/").pop();
      if (docId !== undefined) {
        const docResponse = await this.endpoints[0].documentGetReq(docId);
        const document = this.buildResult(docResponse);
        return new AsyncPredictResponse(docResponse.data, document);
      }
    }
    return new AsyncPredictResponse(queueResponse.data);
  }

  async cutDocPages(inputDoc: InputSource, pageOptions: PageOptions) {
    if (inputDoc.isPdf()) {
      await inputDoc.cutPdf(pageOptions);
    }
  }

  // this is only a separate function because of financial docs
  protected async predictRequest(
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

  protected handleError(response: EndpointResponse, statusCode?: number) {
    const errorMessage = JSON.stringify(response.data, null, 2);
    errorHandler.throw(
      new Error(
        `${this.endpoints[0].urlName} API ${statusCode} HTTP error: ${errorMessage}`
      )
    );
  }

  protected buildResult(
    response: EndpointResponse,
    inputFile?: InputSource
  ): Response<DocType> {
    const statusCode = response.messageObj.statusCode;
    if (statusCode === undefined || statusCode > 201) {
      this.handleError(response, statusCode);
    }
    return new Response<DocType>(this.documentClass, {
      httpResponse: response,
      documentType: this.documentType,
      error: false,
      input: inputFile,
    });
  }

  protected checkApiKeys() {
    this.endpoints.forEach((endpoint) => {
      if (!endpoint.apiKey) {
        throw new Error(
          `Missing API key for '${endpoint.urlName} ${endpoint.version}', check your Client configuration.
You can set this using the '${API_KEY_ENVVAR_NAME}' environment variable.\n`
        );
      }
    });
  }
}

export class CustomDocConfig extends DocumentConfig<CustomV1> {
  constructor({
    endpointName,
    accountName,
    version,
    apiKey,
  }: CustomDocConstructor) {
    const endpoints = [
      new CustomEndpoint(endpointName, accountName, version, apiKey),
    ];
    super(CustomV1, endpoints, endpointName);
  }
}
