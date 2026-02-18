import { URLSearchParams } from "url";
import { InputSource, LocalInputSource } from "@/input/index.js";
import { StringDict } from "@/parsing/stringDict.js";
import { cutDocPages, sendRequestAndReadResponse, BaseHttpResponse } from "@/http/apiCore.js";
import { ApiSettingsV1 } from "./apiSettingsV1.js";
import { handleError } from "./errors.js";
import { PredictParams } from "./httpParams.js";
import { isValidAsyncResponse, isValidSyncResponse } from "./responseValidation.js";

/**
 * Endpoint for a product (OTS or Custom).
 */
export class Endpoint {
  /** Settings relating to the API. */
  settings: ApiSettingsV1;
  /** Root of the URL for API calls. */
  urlRoot: string;
  /** URL of a product. */
  urlName: string;
  /** Account owning the product. */
  owner: string;
  /** Product's version, as a string. */
  version: string;

  constructor(
    urlName: string,
    owner: string,
    version: string,
    settings: ApiSettingsV1
  ) {
    this.settings = settings;
    this.urlRoot = `/v1/products/${owner}/${urlName}/v${version}`;
    this.owner = owner;
    this.urlName = urlName;
    this.version = version;
  }

  /**
   * Sends a document to the API and parses out the result.
   * Throws an error if the server's response contains one.
   * @param {PredictParams} params parameters relating to prediction options.
   * @category Synchronous
   * @returns a `Promise` containing parsing results.
   */
  async predict(params: PredictParams): Promise<BaseHttpResponse> {
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.#predictReqPost(
      params.inputDoc,
      params.includeWords,
      params.fullText,
      params.cropper
    );
    if (!isValidSyncResponse(response)) {
      handleError(this.urlName, response, this.extractStatusMessage(response));
    }
    return response;
  }

  /**
   * Enqueues a prediction to the API.
   * Throws an error if the server's response contains one.
   * @param {PredictParams} params parameters relating to prediction options.
   * @category Asynchronous
   * @returns a `Promise` containing queue data.
   */
  async predictAsync(params: PredictParams): Promise<BaseHttpResponse> {
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.#predictAsyncReqPost(
      params.inputDoc,
      params.includeWords,
      params.fullText,
      params.cropper,
      params.rag,
      params.workflowId
    );
    if (!isValidAsyncResponse(response)) {
      handleError(this.urlName, response, this.extractStatusMessage(response));
    }
    return response;
  }

  private extractStatusMessage(response: BaseHttpResponse): string | undefined {
    if (response.messageObj?.statusMessage !== undefined && response.messageObj?.statusMessage !== null) {
      return response.messageObj?.statusMessage;
    }
    const errorDetail = response.data?.api_request?.error?.detail;
    if (errorDetail) {
      return JSON.stringify(errorDetail);
    }
    const errorMessage = response.data?.api_request?.error?.message;
    if (errorMessage) {
      return JSON.stringify(errorMessage);
    }
    return undefined;
  }

  /**
   * Requests the results of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param queueId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing the parsed result.
   */
  async getQueuedDocument(queueId: string): Promise<BaseHttpResponse> {
    const queueResponse: BaseHttpResponse = await this.#documentQueueReqGet(queueId);
    const queueStatusCode = queueResponse.messageObj.statusCode;
    if (!isValidAsyncResponse(queueResponse)) {
      handleError(this.urlName, queueResponse, this.extractStatusMessage(queueResponse));
    }
    if (
      queueStatusCode === 302 &&
      queueResponse.messageObj.headers.location !== undefined
    ) {
      const docId = queueResponse.messageObj.headers.location.split("/").pop();
      if (docId !== undefined) {
        return await this.#documentGetReq(docId);
      }
    }
    return queueResponse;
  }

  /**
   * Send a feedback
   * @param {string} documentId
   */
  async getDocument(documentId: string): Promise<BaseHttpResponse> {
    const response = await this.#documentGetReq(
      documentId,
    );
    if (!isValidAsyncResponse(response)) {
      handleError("document", response, this.extractStatusMessage(response));
    }
    return response;
  }

  /**
   * Send a feedback
   * @param {string} documentId - ID of the document to send feedback to.
   * @param {StringDict} feedback - Feedback object to send.
   */
  async sendFeedback(
    documentId: string,
    feedback: StringDict
  ): Promise<BaseHttpResponse> {
    const response: BaseHttpResponse = await this.#documentFeedbackPutReq(
      documentId,
      feedback,
    );
    if (!isValidSyncResponse(response)) {
      handleError("feedback", response, this.extractStatusMessage(response));
    }
    return response;
  }

  /**
   * Send a file to a prediction API.
   * @param input
   * @param predictUrl
   * @param includeWords
   * @param fullText
   * @param cropper
   * @param rag
   * @param workflowId
   */
  protected async sendFileForPrediction(
    input: InputSource,
    predictUrl: string,
    includeWords: boolean = false,
    fullText: boolean = false,
    cropper: boolean = false,
    rag: boolean = false,
    workflowId: string | undefined = undefined
  ): Promise<BaseHttpResponse> {
    const searchParams = new URLSearchParams();
    if (cropper) {
      searchParams.set("cropper", "true");
    }
    if (rag) {
      searchParams.set("rag", "true");
    }
    if (fullText) {
      searchParams.set("full_text_ocr", "true");
    }

    const form = new FormData();
    if (input instanceof LocalInputSource && input.fileObject instanceof Buffer) {
      form.set("document", new Blob([input.fileObject]), input.filename);
    } else {
      form.set("document", input.fileObject);
    }
    if (includeWords) {
      form.set("include_mvision", "true");
    }

    let path: string;
    if (workflowId === undefined) {
      path = `${this.urlRoot}/${predictUrl}`;
    } else {
      path = `/v1/workflows/${workflowId}/predict_async`;
    }
    if (searchParams.toString().length > 0) {
      path += `?${searchParams}`;
    }

    const options = {
      method: "POST",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: path,
      timeoutSecs: this.settings.timeoutSecs,
      body: form,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }

  /**
   * Make a request to POST a document for prediction.
   * @param input
   * @param includeWords
   * @param fullText
   * @param cropper
   */
  #predictReqPost(
    input: InputSource,
    includeWords: boolean = false,
    fullText: boolean = false,
    cropper: boolean = false
  ): Promise<BaseHttpResponse> {
    return this.sendFileForPrediction(input, "predict", includeWords, fullText, cropper);
  }

  #predictAsyncReqPost(
    /**
     * Make a request to POST a document for async prediction.
     * @param input
     * @param includeWords
     * @param fullText
     * @param cropper
     * @param rag
     * @param workflowId
     */
    input: InputSource,
    includeWords: boolean = false,
    fullText: boolean = false,
    cropper: boolean = false,
    rag: boolean = false,
    workflowId: string | undefined = undefined
  ): Promise<BaseHttpResponse> {
    return this.sendFileForPrediction(
      input,
      "predict_async",
      includeWords,
      fullText,
      cropper,
      rag,
      workflowId
    );
  }

  /**
   * Make a request to GET the status of a document in the queue.
   * @param queueId
   */
  async #documentQueueReqGet(queueId: string): Promise<BaseHttpResponse> {
    const options = {
      method: "GET",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `${this.urlRoot}/documents/queue/${queueId}`,
      timeoutSecs: this.settings.timeoutSecs,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }

  /**
   * Make a request to GET a document.
   * @param documentId
   */
  async #documentGetReq(documentId: string): Promise<BaseHttpResponse> {
    const options = {
      method: "GET",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `${this.urlRoot}/documents/${documentId}`,
      timeoutSecs: this.settings.timeoutSecs,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }

  /**
   * Make a request to PUT a document feedback.
   * @param documentId
   * @param feedback
   */
  async #documentFeedbackPutReq(documentId: string, feedback: StringDict): Promise<BaseHttpResponse> {
    const options = {
      method: "PUT",
      headers: this.settings.baseHeaders,
      hostname: this.settings.hostname,
      path: `/v1/documents/${documentId}/feedback`,
      body: JSON.stringify(feedback),
      timeoutSecs: this.settings.timeoutSecs,
    };
    return await sendRequestAndReadResponse(this.settings.dispatcher, options);
  }
}
